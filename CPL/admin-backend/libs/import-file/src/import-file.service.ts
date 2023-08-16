import { FixedNumber } from '@ethersproject/bignumber'
import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { Repository } from 'typeorm'
import { read, utils, write } from 'xlsx'
import { BalanceImportExcelFileEntity } from './entites/balance-import-excel-file.entity'
import { BalanceImportExcelRowEntity } from './entites/balance-import-excel-row.entity'
import {
  BALANCE_IMPORT_FILE_STATUS,
  BALANCE_IMPORT_ROW_STATUS,
  IMPORT_FILE_ERRORS,
  IMPORT_FILE_ROW_ERRORS,
  ITEMS_PER_PAGE,
  USER_ID_DEFAULT,
} from './import-file.enum'
import {
  AvailableAmountFile,
  AvaildAmountLine,
  AvailableAmountData,
  BalanceFileInfo,
  BalanceTransaction,
  CancelImportBalanceReponse,
  ConfirmImportBalanceReponse,
  ImportBalanceReponse,
  UploadFileInfo,
} from './interfaces/api-import-excel.interface'
import { BalanceTransactionService as GrpcBalanceTransactionService } from '@lib/grpc-client/balance-transaction/balance-transaction.service'
import {
  BALANCE_TYPE,
  TRANSACTION_TYPE,
} from 'apps/api/src/api-balance/balance.enum'
import {
  flattenErrors,
  formatPagination,
  generatorReferenceIdForImportFile,
} from '@app/common'
import { BalanceImportExcelSettingEntity } from './entites/balance-import-excel-setting.entity'
import { UserService as GrpcUserService } from '@lib/grpc-client/user'
import { UserDto } from '@lib/grpc-client/user/user.dto'
import {
  CreateTransactionRequest,
  TransactionItem,
} from '@lib/grpc-client/balance-transaction/balance-transaction.dto'
import {
  BalanceFileInfoDto,
  BalanceFileSettingCreateRequest,
  BalanceFileSettingRequest,
  BalanceSummaryResponse,
  ListBalanceFilesRequest,
} from './dtos/api-import-excel.dto'
import { Validator } from 'class-validator'
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate'
import { CoinSettingService as GrpcCoinSettingService } from '@lib/grpc-client/common-setting/coin-setting/coin-setting.service'
import {
  BasePaginationQuery,
  ConfirmImportBalanceRequest,
} from 'apps/api/src/api-import-excel/api-import-excel.dto'

@Injectable()
export class ImportFileService {
  constructor(
    @InjectRepository(BalanceImportExcelFileEntity)
    private readonly balanceImportFileRepository: Repository<BalanceImportExcelFileEntity>,

    @InjectRepository(BalanceImportExcelRowEntity)
    private readonly balanceImportRowRepository: Repository<BalanceImportExcelRowEntity>,

    @InjectRepository(BalanceImportExcelSettingEntity)
    private readonly balanceImportExcelSettingRepository: Repository<BalanceImportExcelSettingEntity>,

    private gRPCBalanceTransactionService: GrpcBalanceTransactionService,
    private grpcUserService: GrpcUserService,
    private gRPCCoinSetting: GrpcCoinSettingService,
  ) {}

  private DELETE_USER_STATUS = '2'
  private USER_PENDING_DELETE_STATUS = '3'
  // private USER_KYC_VERIFY_STATUS = 1
  private logger = new Logger()

  convertFullWidthToHalfWidth(str: string) {
    return str.replace(/[\uff01-\uff5e]/g, (ch) =>
      String.fromCharCode(ch.charCodeAt(0) - 0xfee0),
    )
  }

  async importBalance(
    uploadFileInfo: UploadFileInfo,
  ): Promise<ImportBalanceReponse> {
    // read data from file
    const data = read(uploadFileInfo.file, { type: 'buffer' })
    const dataFromSheet = data.Sheets[data.SheetNames[0]]
    const formatKeys = (input: any) => {
      const output = {}
      for (const key of Object.keys(input)) {
        output[key.trim().toLowerCase()] = input[key]
      }
      return output
    }
    const balanceInfos: BalanceFileInfoDto[] = utils
      .sheet_to_json(dataFromSheet)
      .map((item: any) => {
        item = formatKeys(item)
        item.currency =
          typeof item.currency === 'string'
            ? item.currency.trim().toLowerCase()
            : item.currency
        item.email =
          typeof item.email === 'string'
            ? this.convertFullWidthToHalfWidth(item.email).trim()
            : item.email
        if (!isNaN(item.amount)) {
          const amount = String(item.amount)
          item.amount = amount.includes('e-')
            ? Number(amount).toFixed(
                +amount.substring(amount.indexOf('e-') + 2),
              )
            : amount
        }

        return Object.assign(new BalanceFileInfoDto(), item)
      })

    //validation format and data in file
    const valid = new Validator()
    for await (const item of balanceInfos) {
      const errors = await valid.validate(item, {
        skipMissingProperties: false,
        stopAtFirstError: true,
      })
      if (errors.length === 0) continue
      item.status = BALANCE_IMPORT_ROW_STATUS[BALANCE_IMPORT_ROW_STATUS.ERROR]
      item.note = flattenErrors(errors)
        .map((error) => `${error.property}: ${error.msg}`)
        .join('\n')
    }

    const validBalanceInfos = balanceInfos.filter(
      (item) =>
        item.status !==
        BALANCE_IMPORT_ROW_STATUS[BALANCE_IMPORT_ROW_STATUS.ERROR],
    )

    //check data file with settings
    const fileSettings = await this.balanceImportExcelSettingRepository.find()
    const validationFileData = await this.checkFileDataWithSetting(
      validBalanceInfos,
      fileSettings,
    )

    if (validationFileData.is_available)
      return {
        status: false,
        type: IMPORT_FILE_ERRORS.AMOUNT_ERROR,
        data: validationFileData.data,
      }

    const maxLineAmountSettings = this.getMaxAmountLineSetting(fileSettings)
    const balanceImportFileInfo: Partial<BalanceImportExcelFileEntity> = {
      adminId: uploadFileInfo.admin_id,
      fileName: uploadFileInfo.file_name,
      status: BALANCE_IMPORT_FILE_STATUS.PROCESSING,
    }

    const emails = balanceInfos.map((item) => item.email)
    const users = await this.getUsersByEmails(emails)

    //save info file to DB
    const balanceImportFile = await this.balanceImportFileRepository.save(
      plainToInstance(BalanceImportExcelFileEntity, balanceImportFileInfo, {
        ignoreDecorators: true,
      }),
    )

    const balanceImportRows: Partial<BalanceImportExcelRowEntity>[] = []
    for await (const balanceInfo of balanceInfos) {
      //if row have success status then continue
      if (
        balanceInfo.status &&
        String(balanceInfo.status).trim().toUpperCase() ===
          BALANCE_IMPORT_ROW_STATUS[BALANCE_IMPORT_ROW_STATUS.SUCCESS]
      )
        continue

      //verify users
      const user = users.find(
        (user) =>
          user.email.trim().toLowerCase() ===
          balanceInfo.email.trim().toLowerCase(),
      )
      const verifyUser = this.verifyUser(user)

      if (
        balanceInfo.status ===
        BALANCE_IMPORT_ROW_STATUS[BALANCE_IMPORT_ROW_STATUS.ERROR]
      ) {
        const balanceImportRow: Partial<BalanceImportExcelRowEntity> = {
          amount: balanceInfo.amount,
          rowIndex: balanceInfo.id.toString(),
          importFileId: balanceImportFile.id,
          currency: balanceInfo.currency.toLowerCase(),
          email: balanceInfo.email,
          status: BALANCE_IMPORT_ROW_STATUS.ERROR,
          note: balanceInfo.note,
          userId: user ? user.id : USER_ID_DEFAULT, //  If user not exsit then hard code is -1
        }

        balanceImportRows.push(
          plainToInstance(BalanceImportExcelRowEntity, balanceImportRow, {
            ignoreDecorators: true,
          }),
        )
        continue
      }

      const amount = FixedNumber.from(balanceInfo.amount)

      if (!verifyUser.status) {
        const balanceImportRow: Partial<BalanceImportExcelRowEntity> = {
          amount: amount.toString(),
          rowIndex: balanceInfo.id.toString(),
          importFileId: balanceImportFile.id,
          currency: balanceInfo.currency.toLowerCase(),
          email: balanceInfo.email,
          status: BALANCE_IMPORT_ROW_STATUS.ERROR,
          note: verifyUser.data,
          userId: user ? user.id : USER_ID_DEFAULT, //  If user not exsit then hard code is -1
        }

        balanceImportRows.push(
          plainToInstance(BalanceImportExcelRowEntity, balanceImportRow, {
            ignoreDecorators: true,
          }),
        )
        continue
      }

      const maxLineAmountOfCurrency = maxLineAmountSettings.get(
        balanceInfo.currency,
      )
      if (!maxLineAmountOfCurrency) {
        const balanceImportRow: Partial<BalanceImportExcelRowEntity> = {
          amount: amount.toString(),
          rowIndex: balanceInfo.id.toString(),
          importFileId: balanceImportFile.id,
          currency: balanceInfo.currency.toLowerCase(),
          email: balanceInfo.email,
          status: BALANCE_IMPORT_ROW_STATUS.ERROR,
          note: IMPORT_FILE_ROW_ERRORS.CURRENCY_NOT_SETTING,
          userId: user.id,
        }

        balanceImportRows.push(
          plainToInstance(BalanceImportExcelRowEntity, balanceImportRow, {
            ignoreDecorators: true,
          }),
        )
        continue
      }
      //IF currency NOT IS un_limited and amout >= max_amount ? fasle : true
      const subAmountWithMaxLineAmount = amount.subUnsafe(
        maxLineAmountOfCurrency.amount,
      )
      const isAvailAmountLine =
        maxLineAmountOfCurrency.is_unlimited ||
        subAmountWithMaxLineAmount.isNegative() ||
        subAmountWithMaxLineAmount.isZero()

      if (!isAvailAmountLine) {
        const balanceImportRow: Partial<BalanceImportExcelRowEntity> = {
          amount: amount.toString(),
          rowIndex: balanceInfo.id.toString(),
          importFileId: balanceImportFile.id,
          currency: balanceInfo.currency.toLowerCase(),
          email: balanceInfo.email,
          status: BALANCE_IMPORT_ROW_STATUS.ERROR,
          note: IMPORT_FILE_ROW_ERRORS.MAX_LINE_AMOUNT,
          userId: user ? user.id : USER_ID_DEFAULT, //  If user not exsit then hard code is -1
        }

        balanceImportRows.push(
          plainToInstance(BalanceImportExcelRowEntity, balanceImportRow, {
            ignoreDecorators: true,
          }),
        )
        continue
      }

      //build BalanceImportExcelRow data
      const balanceImportRow: Partial<BalanceImportExcelRowEntity> = {
        amount: amount.toString(),
        rowIndex: balanceInfo.id.toString(),
        importFileId: balanceImportFile.id,
        currency: balanceInfo.currency.toLowerCase(),
        email: balanceInfo.email,
        status: BALANCE_IMPORT_ROW_STATUS.PROCESSING,
        note: '',
        userId: user ? user.id : USER_ID_DEFAULT, //  If user not exsit then hard code is -1
      }

      balanceImportRows.push(
        plainToInstance(BalanceImportExcelRowEntity, balanceImportRow, {
          ignoreDecorators: true,
        }),
      )
    }

    await this.balanceImportRowRepository.save(balanceImportRows)
    balanceImportFile.totalRows = balanceImportRows.length
    balanceImportFile.failedRows = balanceImportRows.filter(
      (row) => row.status === BALANCE_IMPORT_ROW_STATUS.ERROR,
    ).length
    await this.balanceImportFileRepository.save(balanceImportFile)
    return { status: true, data: { fileId: balanceImportFile.id } }
  }

  async confirmImportBalance(
    importFileId: string,
    request: ConfirmImportBalanceRequest,
  ): Promise<ConfirmImportBalanceReponse> {
    const balanceImportFile =
      await this.balanceImportFileRepository.findOneOrFail({
        id: importFileId,
        status: BALANCE_IMPORT_FILE_STATUS.PROCESSING,
      })
    const balanceImportRows = await this.balanceImportRowRepository
      .createQueryBuilder()
      .where('import_file_id = :importFileId', { importFileId })
      .andWhere('status = :status', {
        status: BALANCE_IMPORT_ROW_STATUS.PROCESSING,
      })
      .getMany()

    //add balance and transactions
    const balanceTransactions = await this.saveBalanceTransactions(
      request.balance_type,
      balanceImportRows,
    )
    balanceImportRows.forEach((balanceImportRow) => {
      const balanceTransactionsResult = balanceTransactions.filter(
        (item) =>
          item.currency === balanceImportRow.currency &&
          this.compareNumber(item.amount, balanceImportRow.amount) &&
          item.user_id === balanceImportRow.userId,
      )

      //set balannce row status
      balanceImportRow.status =
        balanceTransactionsResult.length > 0
          ? BALANCE_IMPORT_ROW_STATUS.SUCCESS
          : BALANCE_IMPORT_ROW_STATUS.ERROR
    })
    await this.updateRemainAmountSetting(balanceTransactions)
    balanceImportFile.balanceType = request.balance_type
    balanceImportFile.status = BALANCE_IMPORT_FILE_STATUS.SUCCESS
    balanceImportFile.failedRows =
      balanceImportFile.failedRows +
      balanceImportRows.filter(
        (row) => row.status === BALANCE_IMPORT_ROW_STATUS.ERROR,
      ).length
    await this.balanceImportFileRepository.save(balanceImportFile)
    await this.balanceImportRowRepository.save(balanceImportRows)

    return { status: true }
  }

  async cancelImportBalance(
    importFileId: string,
  ): Promise<CancelImportBalanceReponse> {
    const balanceImportFile =
      await this.balanceImportFileRepository.findOneOrFail({
        id: importFileId,
        status: BALANCE_IMPORT_FILE_STATUS.PROCESSING,
      })
    balanceImportFile.status = BALANCE_IMPORT_FILE_STATUS.CANCELLED
    await this.balanceImportFileRepository.save(balanceImportFile)
    await this.balanceImportRowRepository
      .createQueryBuilder()
      .update(BalanceImportExcelRowEntity)
      .where('import_file_id = :importFileId and status = :status', {
        importFileId,
        status: BALANCE_IMPORT_ROW_STATUS.PROCESSING,
      })
      .set({
        status: BALANCE_IMPORT_ROW_STATUS.CANCELLED,
      })
      .execute()
    return { status: true }
  }

  async updateRemainAmountSetting(balanceTransactions: BalanceTransaction[]) {
    const amountPaid: Map<string, FixedNumber> = new Map<string, FixedNumber>()
    //calculate currency total amount in file
    for await (const balanceTransaction of balanceTransactions) {
      const currenyRemainAmount =
        amountPaid.get(balanceTransaction.currency) || FixedNumber.from(0)

      amountPaid.set(
        balanceTransaction.currency,
        currenyRemainAmount.addUnsafe(
          FixedNumber.from(balanceTransaction.amount),
        ),
      )
    }

    //update remain amount for setting
    for await (const [currency, amount] of amountPaid) {
      await this.balanceImportExcelSettingRepository
        .createQueryBuilder()
        .update(BalanceImportExcelSettingEntity)
        .set({
          remainAmount: () => 'remain_amount - ' + amount.toString(),
        })
        .where({ currency })
        .andWhere('is_unlimited != 1')
        .execute()
    }
  }

  async getUsersByEmails(emails: string[]): Promise<UserDto[]> {
    try {
      return await this.grpcUserService.findByEmails(emails)
    } catch (error) {
      this.logger.error("Grpc: Cann't get users fron auth service")
      throw Error(error)
    }
  }

  verifyUser(user: UserDto) {
    if (!user)
      return { status: false, data: IMPORT_FILE_ROW_ERRORS.USER_NOT_FOUND }

    if (user.status === this.DELETE_USER_STATUS)
      return { status: false, data: IMPORT_FILE_ROW_ERRORS.USER_IS_DELETED }

    if (user.status === this.USER_PENDING_DELETE_STATUS)
      return {
        status: false,
        data: IMPORT_FILE_ROW_ERRORS.USER_IS_PENDING_DELETED,
      }

    if (user.isBanned)
      return { status: false, data: IMPORT_FILE_ROW_ERRORS.USER_IS_BANNED }

    // If check kyc status, uncomment below lines
    // if (user.kycVerifyStatus != this.USER_KYC_VERIFY_STATUS)
    //   return { status: false, data: IMPORT_FILE_ROW_ERRORS.USER_NOT_KYC }

    return { status: true }
  }

  async saveBalanceTransactions(
    balanceType: string,
    balanceImportRows: Partial<BalanceImportExcelRowEntity>[],
  ) {
    const balanceTransactions: BalanceTransaction[] = []
    const balanceTransactionImportRows: Map<
      string,
      Partial<BalanceImportExcelRowEntity>[]
    > = new Map<string, TransactionItem[]>()
    const balanceTransactionRequests = new Map<
      string,
      CreateTransactionRequest
    >()

    //1. build data transaction
    for await (const balanceInfo of balanceImportRows) {
      if (balanceInfo.status === BALANCE_IMPORT_ROW_STATUS.ERROR) continue
      if (
        balanceType === BALANCE_TYPE[BALANCE_TYPE.BO] &&
        balanceInfo.currency !== 'bcast' &&
        balanceInfo.currency !== 'usdt'
      ) {
        balanceInfo.note = IMPORT_FILE_ROW_ERRORS.CURRENCY_NOT_AVAILABLE
        continue
      }
      if (
        balanceType === BALANCE_TYPE[BALANCE_TYPE.CASHBACK] &&
        balanceInfo.currency !== 'usdt'
      ) {
        balanceInfo.note = IMPORT_FILE_ROW_ERRORS.CURRENCY_NOT_AVAILABLE
        continue
      }

      const requestKey = balanceInfo.userId + ':' + balanceInfo.currency
      let request = balanceTransactionRequests.get(requestKey)
      request = request || {
        userId: balanceInfo.userId,
        balanceType,
        items: [],
      }
      const balanceTransactionInfo = {
        transactionType: TRANSACTION_TYPE.IMPORT_EXCEL,
        currency: balanceInfo.currency,
        amount: balanceInfo.amount,
        transactionReferenceId: generatorReferenceIdForImportFile(
          balanceInfo.userId,
          balanceInfo.importFileId,
        ),
      }
      request.items.push(balanceTransactionInfo)
      balanceTransactionRequests.set(requestKey, request)
      let importRows = balanceTransactionImportRows.get(requestKey)
      importRows = importRows || []
      importRows.push(balanceInfo)
      balanceTransactionImportRows.set(requestKey, importRows)
    }

    //2. add balance and create transactions
    for await (const [
      requestKey,
      request,
    ] of balanceTransactionRequests.entries()) {
      try {
        const balanceTransactionResponse =
          await this.gRPCBalanceTransactionService.create(request)
        for await (const balanceTransaction of balanceTransactionResponse.balanceTransactions) {
          const balanceAccount =
            balanceTransactionResponse.balanceAccounts.find(
              (item) => item.id === balanceTransaction.balanceAccountId,
            )

          if (!balanceAccount) continue
          balanceTransactions.push({
            user_id: balanceAccount.userId,
            amount: balanceTransaction.amount,
            currency: balanceAccount.currency,
          })
        }
      } catch (error) {
        const note = error.message.split(': ').pop()
        for (const item of balanceTransactionImportRows.get(requestKey)) {
          item.note = note
        }
        this.logger.error('Create transactions errors', error)
      }
    }
    return balanceTransactions
  }

  compareNumber(number1: string, number2: string) {
    const fnumber1 = FixedNumber.from(number1)
    const fnumber2 = FixedNumber.from(number2)

    return fnumber1.subUnsafe(fnumber2).isZero()
  }

  async checkFileDataWithSetting(
    balanceFileInfo: BalanceFileInfo[],
    importFileSettings: BalanceImportExcelSettingEntity[],
  ): Promise<AvailableAmountFile> {
    //get import file settings
    const fileAmount: Map<string, FixedNumber> = new Map<string, FixedNumber>()
    const availdAmountOfCurrencies: Map<string, AvailableAmountData> = new Map<
      string,
      AvailableAmountData
    >()
    let isAvaild = false

    //calculate max amount file with currrencies
    balanceFileInfo.forEach((item) => {
      const totalAmountCurrencyInFile = fileAmount.get(item.currency)
        ? fileAmount.get(item.currency).addUnsafe(FixedNumber.from(item.amount))
        : FixedNumber.from(item.amount)

      fileAmount.set(item.currency, totalAmountCurrencyInFile)
    })

    //check availd amount
    for await (const setting of importFileSettings) {
      // if currency do not exsit or is unlimited setting then skip
      const existCurrency = balanceFileInfo.find(
        (item) => item.currency === setting.currency,
      )
      if (!existCurrency || setting.isUnlimited) continue

      const totalAmountCurrency = fileAmount.get(setting.currency)
      const maxAmountCurrency = FixedNumber.from(setting.maxFileAmount)
      const remainAmount = FixedNumber.from(setting.remainAmount)

      //IF  amount <= max_line_limit AND amount <= remain THEN true ELSE false
      const subAmountWithMaxAmount =
        totalAmountCurrency.subUnsafe(maxAmountCurrency)
      const subAmountWithRemainAmount =
        totalAmountCurrency.subUnsafe(remainAmount)

      const isAvaildAmount =
        (subAmountWithMaxAmount.isNegative() ||
          subAmountWithMaxAmount.isZero()) &&
        (subAmountWithRemainAmount.isNegative() ||
          subAmountWithRemainAmount.isZero())

      if (!isAvaildAmount) {
        isAvaild = true
      }

      const AvailableAmountFile = {
        amount: totalAmountCurrency.toString(),
        max_file_amount: maxAmountCurrency.toString(),
        remain_amount: remainAmount.toString(),
        is_unlimited: setting.isUnlimited,
        is_avalid_amount: isAvaildAmount,
      }

      availdAmountOfCurrencies.set(setting.currency, AvailableAmountFile)
    }

    return { is_available: isAvaild, data: availdAmountOfCurrencies }
  }

  getMaxAmountLineSetting(
    importFileSettings: BalanceImportExcelSettingEntity[],
  ): Map<string, AvaildAmountLine> {
    const maxLineAmount: Map<string, AvaildAmountLine> = new Map<
      string,
      AvaildAmountLine
    >()
    importFileSettings.forEach((setting) => {
      maxLineAmount.set(setting.currency, {
        amount: FixedNumber.from(setting.maxLineAmount),
        is_unlimited: setting.isUnlimited,
      })
    })

    return maxLineAmount
  }

  async getSummary(): Promise<BalanceSummaryResponse> {
    return this.balanceImportFileRepository
      .createQueryBuilder('f')
      .select(
        `
        SUM(total_rows) as total_rows,
        SUM(failed_rows) as failed_rows,
        SUM(CASE WHEN status = ${BALANCE_IMPORT_FILE_STATUS.SUCCESS} THEN total_rows - failed_rows ELSE 0 END) as succeed_rows
        `,
      )
      .getRawOne()
  }

  async getListBalanceFiles(listBalanceFilesRequest: ListBalanceFilesRequest) {
    const options: IPaginationOptions = {
      page: listBalanceFilesRequest.page || 1,
      limit: listBalanceFilesRequest.size || ITEMS_PER_PAGE,
    }
    const query = this.balanceImportFileRepository
      .createQueryBuilder()
      .orderBy('created_at', 'DESC')

    const listFiles = await paginate<BalanceImportExcelFileEntity>(
      query,
      options,
    )

    return {
      data: listFiles.items || [],
      paginate: formatPagination(listFiles.meta),
    }
  }

  async getFile(fileId: string) {
    return this.balanceImportFileRepository.findOne(fileId)
  }

  async getFileRows(fileId: string, paginationQuery: BasePaginationQuery) {
    const options: IPaginationOptions = {
      page: paginationQuery.page || 1,
      limit: paginationQuery.size || ITEMS_PER_PAGE,
    }
    const query = this.balanceImportRowRepository
      .createQueryBuilder()
      .where({ importFileId: fileId })
      .orderBy('row_index', 'ASC')
    const listRows = await paginate<BalanceImportExcelRowEntity>(query, options)

    return {
      data: listRows.items || [],
      pagination: formatPagination(listRows.meta),
    }
  }

  async getDownloadBalanceFile(fileId: string) {
    const data = await this.balanceImportRowRepository
      .createQueryBuilder()
      .where({ importFileId: fileId })
      .orderBy('row_index', 'ASC')
      .getMany()

    const worksheet = utils.json_to_sheet(
      data.map((item) => ({
        id: item.rowIndex,
        email: item.email,
        currency: item.currency,
        amount: item.amount,
        status: BALANCE_IMPORT_ROW_STATUS[item.status],
        note: item.note,
      })),
    )
    const workbook = utils.book_new()
    utils.book_append_sheet(workbook, worksheet)
    return write(workbook, { type: 'buffer', bookType: 'xlsx' })
  }

  async getListSettings(balanceFileSettingRequest: BalanceFileSettingRequest) {
    //B1. Get all coins from coinSetting GRPC
    const currenciesResponse = await this.gRPCCoinSetting.getAllListCoin()
    if (!currenciesResponse.length) throw new Error('currencies is empty!')

    //B2. Get all currencies have setting
    const currencies = currenciesResponse.map((item) => item.coin)
    const settingQuery = this.balanceImportExcelSettingRepository
      .createQueryBuilder()
      .where('currency in (:...currencies)', { currencies })
      .addOrderBy('currency')
    const listCurrencySettingsResponse = await settingQuery.getMany()
    const listCurrencySettings = listCurrencySettingsResponse.map(
      (item) => item.currency,
    )

    //B3. Get currencies have not setting
    const listCurrencyNews = currencies.filter(
      (currency) => !listCurrencySettings.includes(currency),
    )

    //B4. Save settings from new currencies
    if (listCurrencyNews.length > 0) {
      const settingsInfo: Partial<BalanceImportExcelSettingEntity>[] =
        listCurrencyNews.map((item) => {
          return { currency: item }
        })
      await this.balanceImportExcelSettingRepository.save(
        plainToInstance(BalanceImportExcelSettingEntity, settingsInfo),
      )
    }

    const options: IPaginationOptions = {
      page: balanceFileSettingRequest.page || 1,
      limit: balanceFileSettingRequest.size || ITEMS_PER_PAGE,
    }

    if (balanceFileSettingRequest.currency) {
      settingQuery.andWhere({ currency: balanceFileSettingRequest.currency })
    }

    const settingsResponse = await paginate<BalanceImportExcelSettingEntity>(
      settingQuery,
      options,
    )

    return {
      data: settingsResponse.items || [],
      paginate: formatPagination(settingsResponse.meta),
    }
  }

  async updateOrCreateSetting(params: BalanceFileSettingCreateRequest) {
    params['isUnlimited'] = params.isUnlimited || false
    const response = await this.balanceImportExcelSettingRepository
      .createQueryBuilder()
      .update(BalanceImportExcelSettingEntity)
      .set(params)
      .where('currency = :currency', { currency: params.currency })
      .execute()

    return { data: response }
  }
}

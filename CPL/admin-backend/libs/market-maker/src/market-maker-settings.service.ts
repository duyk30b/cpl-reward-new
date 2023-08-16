import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import {
  GetSettingsParams,
  MarketMakerSettingItemDTO,
} from './market-maker.dto'
import { MarketMakerSettingItem } from './market-maker-setting.entity'

@Injectable()
export class MarketMakerSettingService {
  constructor(
    @InjectRepository(MarketMakerSettingItem)
    private readonly mMSettingItemRepository: Repository<MarketMakerSettingItem>,
  ) {}

  async getSettingByPair(
    params: GetSettingsParams,
  ): Promise<MarketMakerSettingItem[]> {
    return this.mMSettingItemRepository.find({
      coin: params.coin,
      currency: params.currency,
    })
  }

  async getSettingItem(
    params: MarketMakerSettingItemDTO,
  ): Promise<MarketMakerSettingItem> {
    return this.mMSettingItemRepository.findOne({
      where: {
        coin: params.coin,
        currency: params.currency,
        property_key: params.propertyKey,
      },
    })
  }

  async updateSettingItem(
    body: MarketMakerSettingItem,
  ): Promise<MarketMakerSettingItem> {
    body.updated_at = new Date().getTime().toString()
    return this.mMSettingItemRepository.save(body)
  }
}

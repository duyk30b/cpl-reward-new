import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Country } from './entities/country.entity'

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country, 'bce')
    private countryRepository: Repository<Country>,
  ) {}

  async getCountryByCode(code: string) {
    const allCountries = await this.countryRepository.find()
    if (!allCountries) {
      return null
    }
    for (let i = 0; i < allCountries.length; i++) {
      const country = allCountries[i]
      const codes = country.code.replace(/ /g, '').split(',')
      if (codes.includes(code)) {
        return country
      }
    }
    return null
  }

  async getCountryById(id: number) {
    return await this.countryRepository.findOne(id)
  }
}

import { Module } from '@nestjs/common'
import { CountryService } from './country.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Country } from './entities/country.entity'

// TODO: Đưa module này về local thay vì gọi sang BCE lấy data

@Module({
  imports: [TypeOrmModule.forFeature([Country], 'bce')],
  providers: [CountryService],
  exports: [CountryService],
})
export class CountryModule {}

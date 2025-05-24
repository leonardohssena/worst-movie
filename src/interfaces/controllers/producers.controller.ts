import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

import { GetProducersByIntervalUseCase } from '@application/useCases/producers'
import { ProducersIntervalResponseDTO } from '@interfaces/dtos/producers'

@ApiTags('Producers')
@Controller('producers')
export class ProducersController {
  constructor(private readonly getProducersByIntervalUseCase: GetProducersByIntervalUseCase) {}

  @Get('interval')
  @ApiOperation({
    summary: 'Find all producers interval between wins',
  })
  @ApiOkResponse({ description: 'Producers interval list.', isArray: true, type: ProducersIntervalResponseDTO })
  async findProducersByInterval(): Promise<ProducersIntervalResponseDTO[]> {
    const producers = await this.getProducersByIntervalUseCase.execute()
    return ProducersIntervalResponseDTO.toViewModel(producers) as ProducersIntervalResponseDTO[]
  }
}

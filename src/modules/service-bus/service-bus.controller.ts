import { Controller, Post, Body, Get, HttpStatus, HttpException } from '@nestjs/common';
import { ServiceBusService, TagData } from './service-bus.service';

export class EnviarTagDto {
  tagId: string;
  timestamp?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  sensorData?: {
    temperature: number;
    humidity: number;
    batteryLevel: number;
  };
  metadata?: Record<string, any>;
}

export class EnviarMultiplasTagsDto {
  tags: EnviarTagDto[];
}

@Controller('service-bus')
export class ServiceBusController {
  constructor(private readonly serviceBusService: ServiceBusService) {}

  /**
   * Testa a conectividade com o Service Bus
   */
  @Get('test')
  async testarConectividade() {
    try {
      const conectividadeOk = await this.serviceBusService.testarConectividade();
      
      return {
        success: conectividadeOk,
        message: conectividadeOk 
          ? 'Conectividade com Service Bus OK' 
          : 'Erro na conectividade com Service Bus',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Erro ao testar conectividade',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Envia dados de teste para o Service Bus
   */
  @Post('test')
  async enviarDadosTeste() {
    try {
      const sucesso = await this.serviceBusService.enviarDadosTeste();
      
      return {
        success: sucesso,
        message: sucesso 
          ? 'Dados de teste enviados com sucesso' 
          : 'Erro ao enviar dados de teste',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Erro ao enviar dados de teste',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Envia dados de uma tag para o Service Bus
   */
  @Post('enviar-tag')
  async enviarTag(@Body() dadosTag: EnviarTagDto) {
    try {
      const tagData: TagData = {
        tagId: dadosTag.tagId,
        timestamp: dadosTag.timestamp || new Date().toISOString(),
        location: dadosTag.location,
        sensorData: dadosTag.sensorData,
        metadata: dadosTag.metadata,
      };

      const sucesso = await this.serviceBusService.enviarDadosTag(tagData);
      
      return {
        success: sucesso,
        message: sucesso 
          ? `Dados da tag ${dadosTag.tagId} enviados com sucesso` 
          : `Erro ao enviar dados da tag ${dadosTag.tagId}`,
        tagId: dadosTag.tagId,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Erro ao enviar dados da tag',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Envia dados de múltiplas tags para o Service Bus
   */
  @Post('enviar-multiplas-tags')
  async enviarMultiplasTags(@Body() dados: EnviarMultiplasTagsDto) {
    try {
      const tagsData: TagData[] = dados.tags.map(tag => ({
        tagId: tag.tagId,
        timestamp: tag.timestamp || new Date().toISOString(),
        location: tag.location,
        sensorData: tag.sensorData,
        metadata: tag.metadata,
      }));

      const resultados = await this.serviceBusService.enviarMultiplasTags(tagsData);
      
      const sucessos = resultados.filter(r => r.success).length;
      const falhas = resultados.filter(r => !r.success).length;
      
      return {
        success: falhas === 0,
        message: `Enviadas ${sucessos} tags com sucesso, ${falhas} falharam`,
        total: resultados.length,
        sucessos,
        falhas,
        resultados,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Erro ao enviar múltiplas tags',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

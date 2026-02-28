import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { CreateIntegrationDto } from './dto/create-integration.dto';
import { UpdateIntegrationDto } from './dto/update-integration.dto';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';

@Controller('integrations')
@UseGuards(JwtGuard)
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) { }

  @Post()
  create(@Request() req, @Body() createIntegrationDto: CreateIntegrationDto) {
    return this.integrationsService.create(req.user.id, createIntegrationDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.integrationsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.integrationsService.findOne(req.user.id, id);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateIntegrationDto: UpdateIntegrationDto) {
    return this.integrationsService.update(req.user.id, id, updateIntegrationDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.integrationsService.remove(req.user.id, id);
  }
}

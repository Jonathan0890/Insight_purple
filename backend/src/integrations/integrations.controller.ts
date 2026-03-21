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
  create(@Request() req, @Body() dto: CreateIntegrationDto) {
    return this.integrationsService.create(req.user.sub, dto);
  }

  @Get()
  findAll(@Request() req) {
    return this.integrationsService.findAll(req.user.sub);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.integrationsService.findOne(req.user.sub, id);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateIntegrationDto,
  ) {
    return this.integrationsService.update(req.user.sub, id, dto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.integrationsService.remove(req.user.sub, id);
  }

  @Post(':id/sync')
  sync(@Request() req, @Param('id') id: string) {
    return this.integrationsService.syncIntegration(req.user.sub, id);
  }
}
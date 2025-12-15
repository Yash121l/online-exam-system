import { Body, Controller, Post } from '@nestjs/common';
import { StorageService } from './storage.service';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload-url')
  getUploadUrl(@Body() body: { key: string; contentType: string }) {
    return this.storageService.generateUploadUrl(body.key, body.contentType);
  }

  @Post('download-url')
  getDownloadUrl(@Body() body: { key: string }) {
    return this.storageService.generateDownloadUrl(body.key);
  }
}

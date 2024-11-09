import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';

@Controller('attachments')
export class AttachmentsController {
  @Get(':fileName')
  async getAttachment(
    @Param('fileName') fileName: string,
    @Res() res: Response,
  ) {
    const filePath = path.join(process.cwd(), 'uploads', fileName);
    res.sendFile(filePath);
  }
}

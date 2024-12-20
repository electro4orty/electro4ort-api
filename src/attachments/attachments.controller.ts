import { storage } from '@/utils/storage';
import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as path from 'path';

@Controller('attachments')
export class AttachmentsController {
  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 99, {
      limits: {
        fieldSize: 1e6 * 50,
        fileSize: 1e6 * 50,
      },
      storage,
    }),
  )
  uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    return files.map((file) => ({
      fileName: file.filename,
      mimeType: file.mimetype,
      size: file.size,
    }));
  }

  @Post('audio')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fieldSize: 1e6 * 50,
        fileSize: 1e6 * 50,
      },
      storage,
    }),
  )
  async uploadAudio(@UploadedFile() file: Express.Multer.File) {
    return {
      fileName: file.filename,
    };
  }

  @Post('video')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fieldSize: 1e6 * 50,
        fileSize: 1e6 * 50,
      },
      storage,
    }),
  )
  async uploadVideo(@UploadedFile() file: Express.Multer.File) {
    return {
      fileName: file.filename,
    };
  }

  @Get(':fileName')
  async getAttachment(
    @Param('fileName') fileName: string,
    @Res() res: Response,
  ) {
    const filePath = path.join(process.cwd(), 'uploads', fileName);
    res.sendFile(filePath);
  }
}

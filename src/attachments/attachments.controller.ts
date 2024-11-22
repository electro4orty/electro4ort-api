import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import * as path from 'path';

@Controller('attachments')
export class AttachmentsController {
  @Post('audio')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fieldSize: 1e6 * 5,
        fileSize: 1e6 * 5,
      },
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const fileName = `${Date.now()}_${file.originalname}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  async uploadAudio(@UploadedFile() file: Express.Multer.File) {
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

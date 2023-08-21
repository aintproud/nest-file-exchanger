import { Controller, Get, UseFilters, Res, ParseUUIDPipe, Param, Post, UseInterceptors, UploadedFile, UploadedFiles, ParseFilePipeBuilder, HttpStatus, UsePipes } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { UUID } from 'crypto';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { AnyFilesInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@UseFilters()
@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	sendFile(@Res() res: Response) {
		res.sendFile('frontend/index.html', { root: '.' });
	}

	@Post()
	@UseInterceptors(AnyFilesInterceptor())
	async uploadFile(@UploadedFiles(
		new ParseFilePipeBuilder()
		  .addMaxSizeValidator({
			maxSize: 1000
		  })
		  .build({
			errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
		  }),
	  ) files: Array<Express.Multer.File>) {
		return await this.appService.handleFiles(files);
	}

	@Get(':id')
	async getById(@Param('id', new ParseUUIDPipe({ version: '4' })) id: UUID) {
		await this.appService.getById(id)
	}
}

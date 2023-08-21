import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { FileArray } from 'express-fileupload';
import { validate } from 'class-validator';

@Injectable()
export class ParseFilePipeBuilder implements PipeTransform<FileArray, Promise<FileArray>> {
  constructor(private readonly minCount: number, private readonly maxCount: number) {}

  async transform(value: FileArray, metadata: ArgumentMetadata): Promise<FileArray> {
    if (!value) {
      throw new BadRequestException('No files provided.');
    }

    if (value.length < this.minCount || value.length > this.maxCount) {
      throw new BadRequestException(`Invalid number of files. Minimum: ${this.minCount}, Maximum: ${this.maxCount}`);
    }

    const validationResult = await validate(value);
    if (validationResult.length > 0) {
      throw new BadRequestException(validationResult);
    }

    return value;
  }
}

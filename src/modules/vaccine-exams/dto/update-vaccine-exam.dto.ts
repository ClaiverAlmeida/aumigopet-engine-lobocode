import { PartialType } from '@nestjs/mapped-types';
import { CreateVaccineExamDto } from './create-vaccine-exam.dto';

export class UpdateVaccineExamDto extends PartialType(CreateVaccineExamDto) {}

import { IsNumber } from 'class-validator';

export class AddTeamMemberDto {
  @IsNumber()
  memberId: number;
}

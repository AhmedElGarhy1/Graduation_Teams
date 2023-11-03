import { IsNumber } from 'class-validator';

export class ChangeTeamLeaderDto {
  @IsNumber()
  leaderId: number;
}

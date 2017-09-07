import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roundWhole'
})
export class RoundWholePipe implements PipeTransform {

  transform (input: number) {
    return Math.round(input);
  }

}

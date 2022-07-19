import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'projectc',
})
export class ProjectcPipe implements PipeTransform {
  transform(teststring: string[]): string {
    return 'abcdef';
  }
}

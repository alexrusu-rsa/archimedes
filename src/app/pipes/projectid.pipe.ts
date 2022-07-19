import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'projectid'
})
export class ProjectidPipe implements PipeTransform {

  transform(): unknown {
    return null;
  }

}

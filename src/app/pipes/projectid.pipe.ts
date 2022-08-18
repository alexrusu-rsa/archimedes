import { Pipe, PipeTransform } from '@angular/core';
import { Project } from '../models/project';

@Pipe({
  name: 'projectid',
})
export class ProjectidPipe implements PipeTransform {
  transform(id: string, projects: Project[]): string {
    if (id)
      if (projects) {
        const matchingProject = projects.filter((project) => project.id === id);
        if (matchingProject) return matchingProject[0].projectName;
        return id;
      }
    return id;
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { Project } from '../models/project';

@Pipe({
  name: 'projectIdName',
})
export class ProjectIdToNamePipe implements PipeTransform {
  transform(id: string, projects: Project[]): string {
    const matchingProject = projects.filter((project) => project.id === id);
    if (matchingProject) return matchingProject[0].projectName;
    return id;
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { Project } from '../models/project';

@Pipe({
  name: 'projectIdToName',
})
export class ProjectIdToNamePipe implements PipeTransform {
  transform(id: string, projects: Project[]): string {
    const matchingProject = projects.find((project) => project.id === id);
    if (matchingProject) return matchingProject.projectName;
    return id;
  }
}

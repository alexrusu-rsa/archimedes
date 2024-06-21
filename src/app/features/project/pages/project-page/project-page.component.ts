import {
  Component,
  DestroyRef,
  Signal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter, switchMap, take } from 'rxjs';
import { Project } from 'src/app/shared/models/project';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  DeleteConfirmationModalComponent,
  deleteConfirmationModalPreset,
} from 'src/app/shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { ProjectService } from 'src/app/features/project/services/project-service/project.service';
import { Icons } from 'src/app/shared/models/icons.enum';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardTitle, MatCardActions } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { EntityItemComponent } from 'src/app/shared/components/entity-item/entity-item.component';
import { EntityPageHeaderComponent } from 'src/app/shared/components/entity-page-header/entity-page-header.component';
import { ProjectModalComponent } from '../../components/project-modal/project-modal/project-modal.component';
import { CustomerService } from 'src/app/features/customer/services/customer-service/customer.service';
import { Customer } from 'src/app/shared/models/customer';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    EntityPageHeaderComponent,
    MatCardActions,
    MatIcon,
    MatButton,
    MatIconButton,
    EntityItemComponent,
  ],
})
export class ProjectPageComponent {
  protected readonly icons = Icons;

  protected search = signal('');

  private readonly destroyRef = inject(DestroyRef);
  private readonly service = inject(ProjectService);
  private readonly customerService = inject(CustomerService);
  private readonly dialog = inject(MatDialog);
  private readonly datePipe = inject(DatePipe);

  private rawCustomers: Signal<Customer[]> = toSignal(
    this.customerService.getCustomers(),
    { initialValue: [] }
  );

  private rawProjects: Signal<Project[]> = toSignal(
    this.service.getProjects().pipe(takeUntilDestroyed(this.destroyRef)),
    { initialValue: [] }
  );

  private projects = computed(() => signal(this.rawProjects()));
  protected filteredProjects = computed(() =>
    this.projects()().filter((project: Project) =>
      project.projectName
        .toLowerCase()
        .includes(this.search().trim().toLowerCase())
    )
  );

  addProject() {
    this.dialog
      .open(ProjectModalComponent, { data: { customers: this.rawCustomers() } })
      .afterClosed()
      .pipe(
        filter((newProject: Project) => !!newProject),
        switchMap((newProject: Project) => {
          const dueDateAsString = this.datePipe.transform(
            newProject.dueDate,
            'dd/MM/yyyy'
          );

          const contractSignDateAsString = this.datePipe.transform(
            newProject.contractSignDate,
            'dd/MM/yyyy'
          );

          const projectToAdd = {
            ...newProject,
            dueDate: dueDateAsString,
            contractSignDate: contractSignDateAsString,
            customerId: newProject.customer?.id,
          };
          return this.service
            .addProject(projectToAdd)
            .pipe(takeUntilDestroyed(this.destroyRef));
        }),
        take(1)
      )
      .subscribe((project: Project) => {
        this.projects().update((projects) => [...projects, project]);
      });
  }

  editProject(project: Project) {
    const dueDateAsDate = this.transformStringToDate(project?.dueDate);

    const contractSignDateAsDate = this.transformStringToDate(
      project?.contractSignDate
    );

    const { id, customerId, ...projectWithoutUnnecessary } = project;

    this.dialog
      .open(ProjectModalComponent, {
        data: {
          project: {
            ...projectWithoutUnnecessary,
            dueDate: dueDateAsDate,
            contractSignDate: contractSignDateAsDate,
          },
          customers: this.rawCustomers(),
        },
      })
      .afterClosed()
      .pipe(
        filter((editedProject: Project) => !!editedProject),
        switchMap((editedProject: Project) => {
          const { customer, ...editedProjectWithoutCustomer } = editedProject;
          const dueDateAsString = this.datePipe.transform(
            editedProject.dueDate,
            'dd/MM/yyyy'
          );

          const contractSignDateAsString = this.datePipe.transform(
            editedProject.contractSignDate,
            'dd/MM/yyyy'
          );
          return this.service
            .updateProject({
              ...editedProjectWithoutCustomer,
              id,
              dueDate: dueDateAsString,
              contractSignDate: contractSignDateAsString,
              customerId: customer.id,
            })
            .pipe(takeUntilDestroyed(this.destroyRef));
        }),
        take(1)
      )
      .subscribe((editedProject: Project) => {
        this.projects().update((projects) =>
          projects.map((project) => {
            if (editedProject?.id === project?.id) return editedProject;
            return project;
          })
        );
      });
  }

  deleteProject(projectId: string) {
    this.dialog
      .open(DeleteConfirmationModalComponent, deleteConfirmationModalPreset)
      .afterClosed()
      .pipe(
        filter((deleteConfirmation) => deleteConfirmation === true),
        switchMap((_) => {
          return this.service
            .deleteProject(projectId)
            .pipe(takeUntilDestroyed(this.destroyRef));
        }),
        take(1)
      )
      .subscribe((_) => {
        this.projects().update((projects) =>
          projects.filter((project) => project.id !== projectId)
        );
      });
  }

  transformStringToDate(dateString: string) {
    if (dateString !== null) {
      const parts = dateString.split('/');
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);

      const dateObject = new Date(year, month, day);
      return dateObject;
    }
    return null;
  }
}

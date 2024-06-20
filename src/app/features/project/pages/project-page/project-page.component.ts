import {
  Component,
  DestroyRef,
  OnInit,
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
import { CommonModule } from '@angular/common';
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
    MatCard,
    MatCardTitle,
    MatCardActions,
    MatIcon,
    MatButton,
    MatIconButton,
    EntityItemComponent,
  ],
})
export class ProjectPageComponent {
  readonly destroyRef = inject(DestroyRef);
  protected readonly icons = Icons;

  private service = inject(ProjectService);
  private customerService = inject(CustomerService);
  private dialog = inject(MatDialog);
  protected search = signal('');

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
          const dueDateAsString = this.transformDateToString(
            newProject.dueDate
          );
          const contractSignDateAsString = this.transformDateToString(
            newProject.contractSignDate
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
        const customer = this.rawCustomers().find(
          (customer) => customer.id === project.customerId
        );
        const newProject = { ...project, customer: customer };
        this.projects().update((projects) => [...projects, newProject]);
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
          const dueDateToString = this.transformDateToString(
            editedProject.dueDate
          );
          const contractSignDateToString = this.transformDateToString(
            editedProject.contractSignDate
          );
          return this.service
            .updateProject({
              ...editedProjectWithoutCustomer,
              id: id,
              dueDate: dueDateToString,
              contractSignDate: contractSignDateToString,
              customerId: customer.id,
            })
            .pipe(takeUntilDestroyed(this.destroyRef));
        }),
        take(1)
      )
      .subscribe((editedProject: Project) => {
        const customer = this.rawCustomers().find(
          (customer) => customer.id === editedProject.customerId
        );
        const editedProjectWithCustomer = {
          ...editedProject,
          customer: customer,
        };

        this.projects().update((projects) =>
          projects.map((project) => {
            if (editedProjectWithCustomer?.id === project?.id)
              return editedProjectWithCustomer;
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

  transformDateToString(date) {
    if (date !== null) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();

      const dateString = `${day}/${month}/${year}`;

      return dateString;
    }
    return null;
  }
}

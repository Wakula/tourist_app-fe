import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { RoleService } from '../_services/role.service';
import { MatDialog } from '@angular/material/dialog';
import { NewRolePopUpComponent } from '../new-role-pop-up/new-role-pop-up.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Role, Trip } from '../trip';
import { User } from '../user'

@Component({
  selector: 'app-trip-roles',
  templateUrl: './trip-roles.component.html',
  styleUrls: ['./trip-roles.component.css']
})
export class TripRolesComponent implements OnInit {
  @Input() trip: Trip;
  @Input() currentUser: User;
  tripRoles: Role[] = [];
  name: string;
  color: string;
  activeRole: number = 0;
  @Output() roleEvent = new EventEmitter<any>();
  @Output() roleDeleteEvent = new EventEmitter<any>();
  
  constructor(
    private dialog: MatDialog,
    private roleService: RoleService
  ) { }

  getRoles() {
    this.tripRoles = [];
    this.roleService.getTripRoles(this.trip.trip_id)
      .subscribe(response => {
        if (response.data.roles) {
          response.data.roles.forEach(element => 
            this.tripRoles.push(element as Role));
        }
      });
    }

  openDialog(): void {
    const dialogRef = this.dialog.open(NewRolePopUpComponent, {
      width: '350px',
      height: '500px',
      data: {
        name: this.name,
        color: this.color
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        result.trip_id = this.trip.trip_id;
        this.addRole(result);
      }
    });
  }

  addRole(data): void {
    this.roleService.addTripRole(data).subscribe(response => {
      console.log(response);
      this.tripRoles.push(response.data);
      this.roleService.setNewRole(response.data);
      this.roleEvent.emit(-1);
    });
  }

  deleteRole(role: Role): void {
    this.roleService.deleteTripRole(role.id).subscribe(response => {
      this.roleDeleteEvent.emit(role);
    });
    var role_index = this.tripRoles.indexOf(role);
    if (role_index > -1) {
    this.tripRoles.splice(role_index, 1);
    }
  }

  activateRole(roleId) {
    if (roleId === this.activeRole) {
      this.activeRole = 0;
    } else {
      this.activeRole = roleId;
    }
    this.roleEvent.emit(this.activeRole);
  }

  deleteRoleDialog(role: Role): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      height: '160px',
      data: `Are you sure to remove ${role.name} from this trip? All items of this category will be deleted`
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.deleteRole(role);
      }
    });
  }
  ngOnInit() {
    this.getRoles();
  }

}

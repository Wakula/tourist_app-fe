import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { TripUserService } from '../_services/trip-user.service';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { User } from '../user';
import { Trip, Role } from '../trip';
import { RoleService } from '../_services/role.service';
import { UserService } from '../_services/user.service';
import { ItemService } from '../_services/item.service';
import { Subscription } from 'rxjs';




@Component({
  selector: 'app-trip-user-list',
  templateUrl: './trip-user-list.component.html',
  styleUrls: ['./trip-user-list.component.css']
})
export class TripUserListComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();
  userId: number;
  tripUsers: User[];
  tripRoles: Role[];
  activeRole: number = 0;
  itemIsSelected: boolean = false;
  items: Map<number, Array<any>> = new Map();
  @Input() trip: Trip;
  @Input() currentUser: User;
  @Output() roleDeleteEvent = new EventEmitter<any>();
  personalInventory: number = 0;


  constructor(
    public dialog: MatDialog,
    private tripUserService: TripUserService,
    private roleService: RoleService,
    private userService: UserService,
    private itemService: ItemService,
  ) {}

  getUsers(): void {
    this.tripUsers = [];
    this.tripUserService.getTripUsers(this.trip.trip_id)
      .subscribe(response => {
        response.data.users.forEach(element => {
          let rolesList = element.roles.filter(role => role.trip_id === this.trip.trip_id);
          element.roles = rolesList.map(role => role.id);
          this.tripUsers.push(element as User);
        });
      for (let user of  this.tripUsers ){
          user.load = 0;
        }
      this.calculateLoadForUsers();
      });
  } 
  processRoleDeletion($event): void {
    this.getUsers();
    this.roleDeleteEvent.emit($event);
  }

  getRoleColor(roleId) {
    let color = 'white';
    this.tripRoles.forEach(role => {
      if (role.id === roleId) {color = role.color;}
    });
    return color;
  }

  deleteUser(userToDelete: User): void {
    this.tripUsers = this.tripUsers.filter(user => user !== userToDelete);
    // delete user_id from trip below
    this.subscription.add(this.tripUserService.deleteTripUser(this.trip.trip_id, userToDelete.user_id).subscribe());
  }

  openDialog(user: User): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      height: '150px',
      data: `Are you sure to remove ${user.name} from this trip?`
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        console.log('Yes clicked');
        this.deleteUser(user);
      }
    });
  }

  receiveRole($event) {
    console.log($event);
    // will refresh roles after new role was created
    if ($event === -1) {
      this.roleService.getTripRoles(this.trip.trip_id)
        .subscribe(response => {
          this.tripRoles = response.data['roles'];
        })
    }
    this.activeRole = $event;
  }

  toggleRole(userId) {
    if (userId == this.userService.getUserId()) {
      return;
    }
    this.tripUserService.toggleRole(this.activeRole, userId)
      .subscribe(response => {
        if (response.status === 201) {
          this.toggleRoleLocally(userId, this.activeRole);
        }
      })
  }

  toggleRoleLocally(userId, roleId) {
    let user = this.tripUsers.find(user => user.user_id === userId);
    let index = user.roles.indexOf(roleId);
    if (index > -1) {
      user.roles.splice(index, 1)
    } else {
      user.roles.push(roleId)
    }
  }

  togglePersonalInventory(userId) {
    this.itemService.togglePersonalInventory(userId)
  }

  isUserAdmin(user_id: number): boolean {
    return user_id == this.trip['admin_id'];
  }

  ngOnInit() {
    this.itemService.togglePersonalInventory(0);
    this.items = new Map();
    this.getUsers();
    this.userId = this.userService.getUserId();
    this.tripRoles = this.trip.roles;
    this.subscription.add(this.itemService.personalInventoryStatus
      .subscribe(status => {
        this.personalInventory = status;
    }));
    this.subscription.add(this.itemService.selectedItem.subscribe(item => {
      if (item == null) {
        this.itemIsSelected = false;
      } else if (this.itemIsSelected == false) {
        this.tripUsers.forEach(
            u => u.itemsAmount = this.getItemsAmount(u.user_id)
        );
        this.itemIsSelected = true;
      } else {
        this.itemIsSelected = false;
        let selectedItemId = this.itemService.selectedItemSource.getValue().equipment_id;
        let selectedItemWeight = this.itemService.selectedItemSource.getValue().weight;

        let dispensedItems = {
          users_eq_amount: []
        };
        let newFrontDispensedItems = [];
        this.tripUsers.forEach(user => {
          dispensedItems.users_eq_amount.push({
            equipment_amount: user.itemsAmount,
            user_id: user.user_id
          });

          newFrontDispensedItems.push({
            amount: user.itemsAmount,
            user_id: user.user_id,
          });
        });
        this.itemService.dispenseItems(dispensedItems, selectedItemId).subscribe(res => {
          if (Number(res.data[1]) >= 400) {
            alert(res.data[0]);
            return;
          }
          this.items.set(selectedItemId, [selectedItemWeight, newFrontDispensedItems]);
          this.calculateLoadForUsers();
        });

      }
    }));
    this.subscription.add(this.itemService.userItems.subscribe(userItems => {
      this.items = new Map();
      if (userItems === null) {
        return;
      }
      userItems.forEach(userItem => {
        this.items.set(userItem.item_id, [userItem.weight, userItem.users]);
      });
      this.calculateLoadForUsers();
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getUserLoad(user) {
    let load = 0;

    if(this.items){
      
      for (let [key, value] of this.items) {
        if(value[1]){

          for(let i = 0; i < value[1].length; i++){
            if (value[1][i].user_id == user.user_id)
            {
              load += value[0] * value[1][i].amount;
            }
          }
        }
        else {
          return user.load;
        }
      }
    }
    return load;
  }
  calculateLoadForUsers()
  {
    for (let user of this.tripUsers){
      user.load = this.getUserLoad(user);
    }
  }
  getItemsAmount(userId: number): number {
    let selectedItemId = this.itemService.selectedItemSource.getValue().equipment_id;
    let result = 0;
    for (let element of this.items.get(selectedItemId)[1]) {
      if (element.user_id == userId) {
        result = element.amount;
      }
    }
    return result;
  }
}

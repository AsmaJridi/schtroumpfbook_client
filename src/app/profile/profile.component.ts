import { Component, OnInit } from '@angular/core';
import { AuthenticationService, UserDetails } from '../authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  details: UserDetails = {
    _id: '',
    email: '',
    name: '',
    role: '',
    friends: [],
    exp: 0,
    iat: 0,
  };
  users: UserDetails[] = [];
  friendIds: string[] = [];
  newFriend: string = '';
  message: string = '';
  ROLES: string[] = [
    'Apprenti',
    'Guerrier',
    'Alchimiste',
    'Sorcier',
    'Espion',
    'Enchanteur',
  ];

  constructor(private auth: AuthenticationService) {}

  ngOnInit() {
    this.auth.profile().subscribe(
      (user) => {
        this.details = user;
      },
      (err) => {
        console.error(err);
      }
    );
    this.auth.users().subscribe(
      (users) => {
        this.users = users;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  update() {
    let data: any = { ...this.details };
    this.friendIds = this.details.friends.map(function (friend) {
      return friend._id;
    });
    if (this.newFriend !== '' && !this.friendIds.includes(this.newFriend)) {
      this.friendIds.push(this.newFriend);
    }
    data.friends = this.friendIds;
    this.auth.update(data).subscribe(
      (user) => {
        this.details = user;
        this.message = 'Profile mis à jour';
      },
      (err) => {
        console.error(err);
      }
    );
  }

  remove(id: string) {
    let data: any = { ...this.details };
    this.friendIds = this.details.friends.map(function (friend) {
      return friend._id;
    });
    this.friendIds = this.friendIds.filter(function (friendId) {
      return friendId !== id;
    });
    data.friends = this.friendIds;
    this.auth.update(data).subscribe(
      (user) => {
        this.details = user;
        this.message = 'Ami supprimé';
      },
      (err) => {
        console.error(err);
      }
    );
  }
}

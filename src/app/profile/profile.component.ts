import { Component, OnInit } from '@angular/core';
import {
  AuthenticationService,
  TokenPayload,
  UserDetails,
} from '../authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  //La personne connectée
  userModel: UserDetails = {
    _id: '',
    email: '',
    name: '',
    role: '',
    friends: [],
    exp: 0,
    iat: 0,
  };
  //la list du select d'ajout d'amis
  users: UserDetails[] = [];
  //le choix du select d'ajout d'amis
  newFriendModel: string = '';
  //les ids des amis de la personne connectée
  friendIds: string[] = [];
  //la list du select du role
  ROLES: string[] = [
    'Apprenti',
    'Guerrier',
    'Alchimiste',
    'Sorcier',
    'Espion',
    'Enchanteur',
  ];
  //le nouveau utilisateur
  newUserModel: TokenPayload = {
    email: '',
    name: '',
    password: '',
  };

  message: string = '';
  constructor(private auth: AuthenticationService) {}

  ngOnInit() {
    this.auth.profile().subscribe(
      (user) => {
        this.userModel = user;
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
    this.friendIds = this.userModel.friends.map(function (friend) {
      return friend._id;
    });

    if (
      this.newFriendModel !== '' &&
      !this.friendIds.includes(this.newFriendModel)
    ) {
      this.friendIds.push(this.newFriendModel);
    }
    //créer une copie de this.userModel
    let data: any = {...this.userModel};
    data.friends = this.friendIds;

    this.auth.update(data).subscribe(
      (user) => {
        this.userModel = user;
        this.message = 'Profile mis à jour';
      },
      (err) => {
        console.error(err);
      }
    );
  }

  remove(id: string) {
    this.friendIds = this.userModel.friends.map(function (friend) {
      return friend._id;
    });
    //laisser uniquement les friendId qui sont différents de id
    this.friendIds = this.friendIds.filter(function (friendId) {
      return friendId !== id;
    });

    let data: any = {...this.userModel};
    data.friends = this.friendIds;
    
    this.auth.update(data).subscribe(
      (user) => {
        this.userModel = user;
        this.message = 'Ami supprimé';
      },
      (err) => {
        console.error(err);
      }
    );
  }

  addUser() {
    this.auth.invite(this.newUserModel).subscribe(
      (user) => {
        this.userModel = user;
        this.newUserModel = { name: '', email: '', password: '' };
        this.message = "Utilisateur créé et ajouté à la liste d'amis";
      },

      (err) => {
        console.error(err);
      }
    );
  }
}

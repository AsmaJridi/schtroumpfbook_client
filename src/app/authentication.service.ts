import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';

export interface UserDetails {
  _id: string;
  email: string;
  name: string;
  role: string;
  friendships: FriendshipDetails[];
  exp: number;
  iat: number;
}

export interface FriendDetails {
  _id: string;
  relationship: string;
}

export interface FriendshipDetails {
  _id: string;
  requester: UserDetails;
  recipient: UserDetails;
  relationship: String;
  status: Number;
}

interface TokenResponse {
  token: string;
}

export interface TokenPayload {
  email: string;
  password: string;
  name?: string;
  relationship?: string;
}

@Injectable()
export class AuthenticationService {
  private token: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  private saveToken(token: string): void {
    localStorage.setItem('mean-token', token);
    this.token = token;
  }

  private getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('mean-token');
    }
    return this.token;
  }

  public getUserDetails(): UserDetails | null {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  private request(
    method: 'post' | 'get',
    type: any,
    data?:
      | TokenPayload
      | UserDetails
      | FriendshipDetails
      | FriendDetails
      | string
  ): Observable<any> {
    let base;

    if (method === 'post') {
      base = this.http.post(`/api/${type}`, data, {
        headers: { Authorization: `Bearer ${this.getToken()}` },
      });
    } else {
      base = this.http.get(`/api/${type}`, {
        headers: { Authorization: `Bearer ${this.getToken()}` },
      });
    }

    const request = base.pipe(
      map((data: any) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );

    return request;
  }

  public register(user: TokenPayload): Observable<any> {
    return this.request('post', 'register', user);
  }

  public login(user: TokenPayload): Observable<any> {
    return this.request('post', 'login', user);
  }

  public profile(): Observable<any> {
    return this.request('get', 'user/profile');
  }

  public updateUser(user: UserDetails): Observable<any> {
    return this.request('post', 'user/update', user);
  }

  public addFriend(data: FriendDetails): Observable<any> {
    return this.request('post', 'user/add-friend', data);
  }

  public createAndAddFriend(data: TokenPayload): Observable<any> {
    return this.request('post', 'user/create-add-friend', data);
  }

  public users(): Observable<any> {
    return this.request('get', 'user/list');
  }

  public updateFriendship(friendship: FriendshipDetails): Observable<any> {
    return this.request('post', 'friendship/update', friendship);
  }

  public deleteFriendship(_id: string): Observable<any> {
    return this.request('post', 'friendship/delete', _id);
  }

  public logout(): void {
    this.token = '';
    window.localStorage.removeItem('mean-token');
    this.router.navigateByUrl('/');
  }
}

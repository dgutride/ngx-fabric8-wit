import { Injectable, Inject } from '@angular/core';
import { Headers, Http, URLSearchParams, Response } from '@angular/http';
import { cloneDeep } from 'lodash';
import { AuthenticationService, User } from 'ngx-login-client';
import { Logger } from 'ngx-base';
import { Observable } from 'rxjs';

import { WIT_API_URL } from '../api/wit-api';

@Injectable()
export class CollaboratorService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private spacesUrl: string;

  constructor(
    private http: Http,
    private logger: Logger,
    private auth: AuthenticationService,
    @Inject(WIT_API_URL) apiUrl: string) {
    if (this.auth.getToken() != null) {
      this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
    }
    this.spacesUrl = apiUrl + 'spaces';
  }

  getAllBySpaceId(spaceId: string): Observable<User[]> {
    let url = this.spacesUrl + '/' + spaceId + '/collaborators';
    return this.http
      .get(url, { headers: this.headers })
      .map(response => {
        let collaborators: User[] = response.json().data as User[];
        return collaborators;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  addCollaborators(spaceId: string, users: User[]): Observable<Response> {
    let url = this.spacesUrl + "/" + spaceId + '/collaborators';
    let payload = JSON.stringify({ data: users });
    return this.http
      .post(url, payload, { headers: this.headers })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  removeCollaborator(spaceId: string, collaboratorId: string): Observable<void> {
    let url = this.spacesUrl + "/" + spaceId + '/collaborators/' + collaboratorId;
    return this.http
      .delete(url, { headers: this.headers })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  private handleError(error: any) {
    this.logger.error(error);
    return Observable.throw(error.message || error);
  }

}

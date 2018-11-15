import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe qui permet de transformer un objet JS en array
 * Utilisé pour l'affichage du suivi des demandes
 * (on ne connait pas le format ni la taille de l'objet retourné)
 * @param {'safe'}} {name [description]
 */
@Pipe({ name: 'keys',  pure: false })
export class KeysPipe implements PipeTransform {
    transform(value, args:string[]) : any {
    let keys = [];
    for (let key in value) {
      keys.push({key: key, value: value[key]});
    }
    return keys;
  }
}
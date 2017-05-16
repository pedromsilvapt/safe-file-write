import * as fs from 'fs-promise';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import * as isThere from 'is-there';

export function ensureDir ( dir : string ) : Promise<string> {
    return new Promise<string>( ( resolve, reject ) => {
        mkdirp( dir, ( err : any ) => {
            if ( err ) {
                return reject( err );
            }

            resolve( dir );
        } );
    } );
}

export function fileExists ( target : string ) : Promise<boolean> {
    return new Promise<boolean>( ( resolve, reject ) => {
        isThere( target, ( exists : boolean ) => {
            resolve( exists );
        } );
    } );
}

export async function availableTempName( target : string, separator : string = '~', start : number = 0, hideFirst : boolean = false ) : Promise<string> {
    let ext = path.extname( target );
    let prefix = path.join( path.dirname( target ), path.basename( target, ext ) );

    let template : string;
    let index : number = start;

    do {
        if ( index === start && hideFirst ) {
            template =  prefix + ext;
        } else {
            template =  prefix + separator + index + ext;
        }

        index++;
    } while ( await fileExists( template ) );

    return template;
}

export async function writeFile ( target : string, content : string | Buffer | NodeJS.ReadableStream ) : Promise<void> {
    if ( typeof content === 'string' || Buffer.isBuffer( content ) ) {
        await fs.writeFile( target, content );
    } else {
        return new Promise<void>( ( resolve, reject ) => {
            try {
                content.pipe( fs.createWriteStream( target ) ).on( 'error', reject ).on( 'finish', resolve );
            } catch ( error ) {
                reject( error );
            }
        } );
    }
}

export function rename ( oldName : string, newName : string ) : void {
    fs.moveSync( oldName, newName, { overwrite: true } );
}

export default async function safeFileWrite ( target : string, content : string | Buffer | NodeJS.ReadableStream ) : Promise<string> {
    await ensureDir( path.dirname( target ) );

    const tempTarget = await availableTempName( target );

    await writeFile( tempTarget, content );

    rename( tempTarget, target );

    return target;
}
export function getUser() {
    let user: any = null;
    if (localStorage.getItem('user') !== null) {
        user = JSON.parse(localStorage.getItem('user') as string);
    }
    return user;
}
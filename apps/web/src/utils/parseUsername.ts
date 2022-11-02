export const parseUsername = (name: string) => {
    const nameSplit = name.split(' ')
    if (nameSplit[1]) return name.charAt(0) + nameSplit[1].charAt(0)
    else return name.charAt(0) + name.charAt(1)
}

export default {
    nowUser: null,
    nowUserType: 0,
}

export function setCookies(username,usertype) {
    this.nowUser = username
    this.nowUserType = usertype
    this.$cookies
}

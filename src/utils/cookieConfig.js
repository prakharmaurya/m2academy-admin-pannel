// For Cookies set, get and delete
/**
 * cname = Cookies name
 * cvalue = Cookies
 * exdays = ki token kab expiry (in days)
 */
const setCookie = (cname, cvalue, exdays = 1 / 12) => {
  const maxAge = 'Max-Age=' + exdays * 24 * 60 * 60
  document.cookie = `${cname}=${cvalue}; ${maxAge}; path=/; HttpOnly:true; SameSite=Lax;`
}

function getCookie(cname) {
  const name = cname + '='
  const decodedCookie = decodeURIComponent(document.cookie)
  const ca = decodedCookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length)
    }
  }
  return null
}

function deleteCookie(name) {
  document.cookie = name + '=; Max-Age=-99999999;'
}

export { setCookie, getCookie, deleteCookie }

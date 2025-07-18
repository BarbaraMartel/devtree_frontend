export type User = {
    handle: string
    name: string
    email: string
    _id: string
    description: string
    image: string
    links: string
    visits?: number // 👈 Añadido opcionalmente por si aún no existe en algunos usuarios
}

export type UserHandle = Pick<User, 'description' | 'handle' | 'image' | 'links' | 'name'> & {
    visits: number // 👈 Añadido aquí explícitamente
}

export type RegisterForm = Pick<User, 'handle' | 'email' | 'name'> & {
    password: string
    password_confirmation: string
}

export type LoginForm = Pick<User, 'email'> & {
    password: string
}

export type ProfileForm = Pick<User, 'handle' | 'description'>

export type SocialNetwork = {
    id: number
    name: string
    url: string
    enabled: boolean
}

export type DevTreeLink = Pick<SocialNetwork, 'name' | 'url' | 'enabled'>

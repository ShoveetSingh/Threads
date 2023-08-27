import * as z from 'zod'

export const UserValidation = z.object({
    profile_photo:z.string().url().nonempty(),
    name:z.string().nonempty(),
    username:z.string().min(3).max(20),
    bio:z.string().max(1000).min(3),
});
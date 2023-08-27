"use client"

import {useForm} from 'react-hook-form'
import * as z from "zod"

import Image from "next/image";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import {zodResolver} from '@hookform/resolvers/zod';
import { UserValidation } from '@/lib/validations/user';
import { Input} from '@/components/ui/input';
import { Textarea} from '@/components/ui/textarea';
import { Button } from "@/components/ui/button";
import { ChangeEvent, useState } from 'react'; 
import { isBase64Image } from '@/lib/utils';
import { useUploadThing } from "@/lib/uploadthing";


interface Props {
    user: {
      id: string;
      objectId: string;
      username: string;
      name: string;
      bio: string;
      image: string;
    };
    btnTitle: string;
  }

const AccountProfile =({user,btnTitle}:Props) => {
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("media");
    const form = useForm({
     resolver: zodResolver(UserValidation),
      defaultValues: {
        username: user?.username||'',
        name: user?.name||'',
        bio: user?.bio||'',
        profile_photo: user?.image||'' 
      },
    });


    const handleImage = (e:ChangeEvent<HTMLInputElement>, fieldChange:(value:string)=>void) => {
      e.preventDefault();
      const filereader = new FileReader();
      if(e.target.files && e.target.files.length > 0){
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));
      filereader.onload = async(event) =>{
        const image = event.target?.result?.toString() || '';
        fieldChange(image);
      }
      filereader.readAsDataURL(file);
      }
    }

    const onSubmit = async  (values: z.infer<typeof UserValidation>) => {
     const blob = values.profile_photo;

     const hasImageChanged = isBase64Image(blob);

     if(hasImageChanged){
      const imgRes = await startUpload(files);

      if(imgRes && imgRes[0].fileUrl){
        values.profile_photo = imgRes[0].fileUrl;
      }
     }
    }

    return(
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} 
           className="flex flex-col justify-start gap-10">
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="account-form_image-label">
                {
                  field.value?(
                    <Image
                      src={field.value}
                      alt="Profile photo"
                      width={100}
                      height={100}
                      className="rounded-full object-contain"
                      />
                  ):(
                    <Image
                      src="/assets/profile.svg"
                      alt="Profile photo"
                      width={100}
                      height={100}
                      className="rounded-full object-contain"
                      />
                  )
    }
              </FormLabel>
              <FormControl className='flex-1 text-base-semibold text-gray-200'>
                <Input 
                type="file" 
                accept="image/*"
                placeholder="Upload a photo"
                className='account-form_image-input'
                onChange={(e) =>handleImage(e,field.onChange)}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col items-baseline gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
              UserName
              </FormLabel>
              <FormControl >
                <Input 
                type="text" 
                className='account-form_input no-focus'
                {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
              Name
              </FormLabel>
              <FormControl>
                <Input 
                type="text" 
                className='account-form_input no-focus'
                {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex flex-col items-baseline gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
              Bio
              </FormLabel>
              <FormControl className='flex-1 text-base-semibold text-gray-200'>
                <Textarea
                rows={10} 
                className='account-form_input no-focus'
                {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
        type="submit"
        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:to-yellow-500"
        >Submit</Button>
      </form>
    </Form>

    )
}
 
export default AccountProfile;

function startUpload(files: File[]) {
  throw new Error('Function not implemented.');
}

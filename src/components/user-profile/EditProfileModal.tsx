import type { CustomFlowbiteTheme } from "flowbite-react";
import { Flowbite, Modal } from "flowbite-react";
import { api } from "~/utils/api";
import React, { useState } from 'react'
import type { FieldValues, SubmitHandler } from 'react-hook-form';
import { VscEdit } from "react-icons/vsc";
import { useForm } from 'react-hook-form';
import { CldUploadButton } from 'next-cloudinary';
import { toast } from 'react-hot-toast';

import { Button } from "../shared/Button";
import Input from "../inputs/Input";
import { MAX_BIO_LENGTH } from "~/config/constants";
import { Banner } from "./Banner";
import Textarea from "../inputs/Textarea";
import { ProfileImage } from "../shared/ProfileImage";


interface EditProfileModalProps {
  user: {image: string | null, id: string, name: string | null, handle: string | null, bio: string | null, banner: string | null};
  openModal: boolean, 
  onCloseModal: () => void, 
}

const customTheme: CustomFlowbiteTheme = {
  modal: {
    header: {
      base: 'flex flex-row-reverse items-center justify-between rounded-t dark:border-gray-600 border-b mt-1',
      title: 'text-xl font-medium text-gray-900 dark:text-white flex-grow',
    },
  }
};

export function EditProfileModal({user, openModal, onCloseModal}: EditProfileModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const trpcUtils = api.useUtils();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: {
      errors,
    }
  } = useForm<FieldValues>({
    defaultValues: {
      name: user?.name,
      image: user?.image,
      handle: user?.handle,
      bio: user?.bio,
      banner: user?.banner,
    }
  });

  const currFields = watch();
  const noValuesChanged = currFields.name === user?.name 
    && currFields.handle === user?.handle 
    && currFields.bio === user?.bio 
    && currFields.image === user?.image 
    && currFields.banner === user?.banner;

  // @ts-ignore cloudinary types are unusable here
  const handlePfpUpload = (result) => {
    setValue('image', result.info?.secure_url, { 
      shouldValidate: true 
    });
  }

  // @ts-ignore cloudinary types are unusable here
  const handleBannerUpload = (result) => {
    setValue('banner', result.info.secure_url, { 
      shouldValidate: true 
    });
  }

  const updateProfile = api.profile.update.useMutation({
    onSuccess: ( updatedUser ) => {
      trpcUtils.profile.getById.setData({ id: updatedUser.id }, (oldData) => {
        if (oldData == null) return;

        return {
          ...oldData,
          ...updatedUser,
        };
      });
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    updateProfile.mutate({
      userId: user?.id,
      name: data.name,
      handle: data.handle,
      bio: data.bio,
      image: data.image,
      banner: data.banner,
    }, {
      onSuccess: () => {
        toast.success('Profile updated successfully!');
        onCloseModal();
      },
      onError: (error: {message: string}) => {
        toast.error('Something went wrong');
        setSubmitError(error.message);
        setIsLoading(false);
      },
      onSettled: () => {
        setIsLoading(false);
      }
    })
  }

  const onClose = () => {
    reset();
    setSubmitError(null);
    onCloseModal();
  }

  const charCountClass = currFields.bio?.length > MAX_BIO_LENGTH - 20 ? "text-red-500" : "";
  const charCountDisplay = MAX_BIO_LENGTH - (currFields.bio?.length ?? 0);
  
  return (
    // @ts-ignore
    <Flowbite theme={{ theme: customTheme }}>
      <Modal show={openModal} position={"center"} size="xl" onClose={onClose} popup>
        <Modal.Header title="Edit Profile">
          <div className="flex space-between px-2">
            <div className="py-1 px-4 font-bold">Edit Profile</div>
            <Button 
              disabled={isLoading || noValuesChanged}
              small={true}
              type="submit"
              form="edit-profile-form"
              className="ml-auto text-sm font-bold px-4"
              variant="black"
            >
              Save
            </Button>
          </div>
        </Modal.Header>
        <Modal.Body>
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <form onSubmit={handleSubmit(onSubmit)} id="edit-profile-form" className="max-h-[36rem] pt-2">
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <div className="flex flex-col gap-y-4">
                  <div className="relative mb-8">
                    <div className="brightness-75">
                      <Banner image={currFields.banner || user?.banner || '/images/placeholder.webp'}/>
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 opacity-75">
                      <CldUploadButton 
                        options={{ maxFiles: 1 }} 
                        onUpload={handleBannerUpload} 
                        uploadPreset="pqvw1zzo"
                      >
                        <Button
                          disabled={isLoading}
                          small={true}
                          variant="black"
                          type="button"
                          className="px-[8px] py-[8px] opacity-75"
                        >
                          <VscEdit className="h-5 w-5"/>
                        </Button>
                      </CldUploadButton>
                    </div>

                    <div className="absolute -bottom-[3rem] left-4">
                      <div className="rounded-full border-white border-[0.2rem]">
                        <ProfileImage
                          className="h-[6rem] w-[6rem] brightness-75" 
                          src={currFields.image || user?.image}
                        />
                      </div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 opacity-75">
                        <CldUploadButton 
                            options={{ maxFiles: 1 }} 
                            onUpload={handlePfpUpload} 
                            uploadPreset="pqvw1zzo"
                          >
                          <Button
                            disabled={isLoading}
                            small={true}
                            variant="black"
                            type="button"
                            className="px-[6px] py-[6px] opacity-75"
                          >
                            <VscEdit className="h-4 w-4"/>
                          </Button>
                        </CldUploadButton>
                      </div>
                    </div>
                  </div>
                  <Input
                    disabled={isLoading}
                    label="Name" 
                    id="name" 
                    errors={errors} 
                    required 
                    register={register}
                  />
                  <Input
                    disabled={isLoading}
                    label="Handle" 
                    id="handle" 
                    errors={errors} 
                    required 
                    register={register}
                  />
                  <div className="relative">
                    <Textarea
                      disabled={isLoading}
                      label="Bio"
                      id="bio"
                      errors={errors}
                      maxLength={MAX_BIO_LENGTH}
                      placeholder="A short bio"
                      register={register}
                    />
                    <div className="text-xs text-slate-500 w-14 mx-2 absolute -right-[1.25rem] -bottom-[1.125rem]">
                      <span className={charCountClass}>{charCountDisplay}</span><span>  / {MAX_BIO_LENGTH}</span>
                    </div>
                  </div>
                  {submitError && <div className="text-red-500">{submitError}</div>}
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </Flowbite>
  );
}

export default EditProfileModal;

import { useEffect, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { social } from "../data/social"
import DevTreeInput from "../components/DevTreeInput"
import { isValidUrl } from "../utils"
import { toast } from "sonner"
import { updateProfile } from "../api/DevTreeAPI"
import { SocialNetwork, User } from "../types"

export default function LinkTreeView() {
  const [devTreeLinks, setDevTreeLinks] = useState(social)

  const queryClient = useQueryClient()
  const user: User = queryClient.getQueryData(['user'])!

  const { mutate } = useMutation({
    mutationFn: updateProfile,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => {
      toast.success('Actualizado correctamente')
      queryClient.setQueryData(['user'], data) // actualiza la caché con los datos del backend
    }
  })

  useEffect(() => {
    const updatedData = devTreeLinks.map(item => {
      const userlink = JSON.parse(user.links).find((link: SocialNetwork) => link.name === item.name)
      if (userlink) {
        return { ...item, url: userlink.url, enabled: userlink.enabled }
      }
      return item
    })
    setDevTreeLinks(updatedData)
  }, [])

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedLinks = devTreeLinks.map(link =>
      link.name === e.target.name ? { ...link, url: e.target.value } : link
    )
    setDevTreeLinks(updatedLinks)
  }

  const handleEnableLink = (socialNetwork: string) => {
    const updatedLinks = devTreeLinks.map(link => {
      if (link.name === socialNetwork) {
        if (isValidUrl(link.url)) {
          return { ...link, enabled: !link.enabled }
        } else {
          toast.error('URL no válida')
        }
      }
      return link
    })

    setDevTreeLinks(updatedLinks)
  }

  const handleGuardar = () => {
    const updatedLinks: SocialNetwork[] = devTreeLinks.map((link, index) => ({
      ...link,
      id: index + 1 // nuevo ID
    }))

    const updatedUser: User = {
      ...user,
      links: JSON.stringify(updatedLinks)
    }

    mutate(updatedUser)
  }

  return (
    <div className="space-y-5">
      {devTreeLinks.map(item => (
        <DevTreeInput
          key={item.name}
          item={item}
          handleUrlChange={handleUrlChange}
          handleEnableLink={handleEnableLink}
        />
      ))}
      <button
        className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded-lg font-bold"
        onClick={handleGuardar}
      >
        Guardar Cambios
      </button>
    </div>
  )
}

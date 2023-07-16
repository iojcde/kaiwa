import { Avatar } from "@/components/ui/avatar"
import { Button } from "../ui/button"
import Image from "next/image"
const users = [
  {
    name: "Gotoh Hitori",
    photo: "/images/bocchi.jpg",
    color: "#F3A0BE",
  },
  {
    name: "Kita Ikuyo",
    photo: "/images/kita.jpg",
    color: "#C64D52",
  },
]

export const CollabDemo = () => (
  <div
    className={
      "before:content-[' '] mx-auto flex items-center justify-end gap-4 text-xs text-gray-11 before:block before:h-2 before:w-2 before:rounded-full before:bg-stone-300 data-[status='connected']:before:bg-emerald-500 sm:text-base lg:gap-6"
    }
    data-status={"connected"}
  >
    <span className="group overflow-ellipsis whitespace-nowrap lg:text-xl">
      2 users in room
    </span>

    <Button
      className="hidden h-12 select-none text-lg lg:inline-block"
      variant="outline"
      size="default"
    >
      Share
    </Button>

    <div className="group flex flex-row-reverse items-center">
      {users.length > 0 &&
        users.map((user: { name: string; photo: string; color: string }, n) => {
          if (n < 4) {
            return (
              <Avatar
                key={n}
                className={`${
                  n != 0
                    ? "-mr-4 h-8 w-8 transition-all group-hover:mr-0 lg:h-14 lg:w-14"
                    : "h-9 w-9 lg:h-16 lg:w-16"
                } ring-2 ring-offset-1 dark:ring-offset-background lg:ring-[3px] lg:ring-offset-[3px]`}
                style={
                  {
                    "--tw-ring-color": user?.color,
                    zIndex: users?.length - n,
                  } as React.CSSProperties
                }
              >
                <Image
                  width={256}
                  height={256}
                  quality={100}
                  className={`object-cover ${
                    n == 0
                      ? "h-9 w-9 lg:h-[4.5rem] lg:w-[4.5rem]"
                      : " h-8 w-8  lg:h-16 lg:w-16"
                  }`}
                  src={user?.photo}
                  alt={"bocchi"}
                />
              </Avatar>
            )
          }
        })}
    </div>
  </div>
)

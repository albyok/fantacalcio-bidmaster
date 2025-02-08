import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const formatPlayerNameForImage = (name: string) => {
    return name.toUpperCase().replace(/\s+/g, "-").replace(/[.'’]/g, "");
};

export const PlayerAvatar = ({ name }: { name: string }) => {
    const avatarClass = "w-[60px] h-[80px] object-cover";

    return (
        <Avatar className={avatarClass}>
            <AvatarImage
                src={`https://content.fantacalcio.it/web/campioncini/medium/${formatPlayerNameForImage(
                    name
                )}.png`}
                alt={name}
            />
            <AvatarFallback>
                {name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
            </AvatarFallback>
        </Avatar>
    );
};

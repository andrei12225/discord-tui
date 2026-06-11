import { Box, Text } from "ink";
import React from "react";
import { useAppMembers } from "../../utils/MemberManager.js";

export default function MembersDisplay() {
    const memberManager = useAppMembers();

    return (
        <Box paddingX={1} borderStyle={'classic'} width={'20%'} flexDirection="column" gap={0.5}>
            {
                memberManager.list.map((member) => (
                    <Box gap={1}>
                        <Text inverse backgroundColor={member.displayHexColor} key={member.id}>
                            {member.displayName} 
                        </Text>
                        <Text color={member.statusColor}>{member.status}</Text>
                    </Box>
                ))
            }
        </Box>
    )
}
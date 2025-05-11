import { Timeline, Text, Image } from '@chakra-ui/react';
import { RxUpdate } from "react-icons/rx";

function PatchConnect({ patch }) {
    return(
      <Timeline.Item>
        <Timeline.Connector>
          <Timeline.Separator />
          <Timeline.Indicator>
            <RxUpdate />
          </Timeline.Indicator>
        </Timeline.Connector>
        <Timeline.Content>
          <Timeline.Title>{patch.title}</Timeline.Title>
          <Image src={patch.source} alt={patch.alt} rounded="3xl"></Image>
          <Timeline.Description textAlign="left">{patch.date}</Timeline.Description>
            <Text textStyle="sm" textAlign="left">
                {patch.fullContent}
            </Text>
        </Timeline.Content>
        </Timeline.Item>
    );
}

export default PatchConnect;
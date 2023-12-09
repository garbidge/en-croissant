import {
  showArrowsAtom,
  moveInputAtom,
  autoPromoteAtom,
  autoSaveAtom,
  percentageCoverageAtom,
  minimumGamesAtom,
  forcedEnPassantAtom,
  pieceSetAtom,
  showDestsAtom,
  showCoordinatesAtom,
} from "@/atoms/atoms";
import {
  ActionIcon,
  Card,
  Group,
  ScrollArea,
  Stack,
  Table,
  Tabs,
  Text,
  Tooltip,
} from "@mantine/core";
import ColorControl from "./ColorControl";
import SettingsNumberInput from "./SettingsNumberInput";
import SettingsSelect from "./SettingsSelect";
import SettingsSwitch from "./SettingsSwitch";
import ThemeButton from "./ThemeButton";
import { useLoaderData } from "react-router-dom";
import {
  IconBook,
  IconBrush,
  IconChess,
  IconFlag,
  IconKeyboard,
  IconReload,
} from "@tabler/icons-react";
import FontSizeSlider from "./FontSizeSlider";
import KeybindInput from "./KeybindInput";
import { useAtom } from "jotai";
import { keyMapAtom } from "@/atoms/keybinds";
import { RESET } from "jotai/utils";
import * as classes from "./SettingsPage.css";

const pieceSets = [
  { label: "Alpha", value: "alpha" },
  { label: "Anarcandy", value: "anarcandy" },
  { label: "California", value: "california" },
  { label: "Cardinal", value: "cardinal" },
  { label: "Cburnett", value: "cburnett" },
  { label: "Chess7", value: "chess7" },
  { label: "Chessnut", value: "chessnut" },
  { label: "Companion", value: "companion" },
  { label: "Disguised", value: "disguised" },
  { label: "Dubrovny", value: "dubrovny" },
  { label: "Fantasy", value: "fantasy" },
  { label: "Fresca", value: "fresca" },
  { label: "Gioco", value: "gioco" },
  { label: "Governor", value: "governor" },
  { label: "Horsey", value: "horsey" },
  { label: "ICpieces", value: "icpieces" },
  { label: "Kosal", value: "kosal" },
  { label: "Leipzig", value: "leipzig" },
  { label: "Letter", value: "letter" },
  { label: "Libra", value: "libra" },
  { label: "Maestro", value: "maestro" },
  { label: "Merida", value: "merida" },
  { label: "Pirouetti", value: "pirouetti" },
  { label: "Pixel", value: "pixel" },
  { label: "Reillycraig", value: "reillycraig" },
  { label: "Riohacha", value: "riohacha" },
  { label: "Shapes", value: "shapes" },
  { label: "Spatial", value: "spatial" },
  { label: "Staunty", value: "staunty" },
  { label: "Tatiana", value: "tatiana" },
];

export default function Page() {
  const version = useLoaderData() as string;
  const [keyMap, setKeyMap] = useAtom(keyMapAtom);

  return (
    <Tabs defaultValue="board" orientation="vertical" h="100%">
      <Tabs.List>
        <Tabs.Tab value="board" leftSection={<IconChess size="1rem" />}>
          Board
        </Tabs.Tab>
        <Tabs.Tab value="report" leftSection={<IconBook size="1rem" />}>
          Opening Report
        </Tabs.Tab>
        <Tabs.Tab value="anarchy" leftSection={<IconFlag size="1rem" />}>
          Anarchy
        </Tabs.Tab>
        <Tabs.Tab value="appearance" leftSection={<IconBrush size="1rem" />}>
          Appearance
        </Tabs.Tab>
        <Tabs.Tab value="keybinds" leftSection={<IconKeyboard size="1rem" />}>
          Keybinds
        </Tabs.Tab>
      </Tabs.List>
      <Stack style={{ flex: 1 }} px="md" pt="md">
        <ScrollArea>
          <Card withBorder p="lg" className={classes.card} w="100%">
            <Tabs.Panel value="board">
              <Text size="lg" fw={500} className={classes.title}>
                Board
              </Text>
              <Text size="xs" c="dimmed" mt={3} mb="lg">
                Customize the analysis board and game controls
              </Text>
              <Group
                justify="space-between"
                wrap="nowrap"
                gap="xl"
                className={classes.item}
              >
                <div>
                  <Text>Piece Destinations</Text>
                  <Text size="xs" c="dimmed">
                    Show possible moves for each piece
                  </Text>
                </div>
                <SettingsSwitch atom={showDestsAtom} />
              </Group>
              <Group
                justify="space-between"
                wrap="nowrap"
                gap="xl"
                className={classes.item}
              >
                <div>
                  <Text>Arrows</Text>
                  <Text size="xs" c="dimmed">
                    Show best move arrows
                  </Text>
                </div>
                <SettingsSwitch atom={showArrowsAtom} />
              </Group>
              <Group
                justify="space-between"
                wrap="nowrap"
                gap="xl"
                className={classes.item}
              >
                <div>
                  <Text>Text Move Input</Text>
                  <Text size="xs" c="dimmed">
                    Enter moves in text format
                  </Text>
                </div>
                <SettingsSwitch atom={moveInputAtom} />
              </Group>
              <Group
                justify="space-between"
                wrap="nowrap"
                gap="xl"
                className={classes.item}
              >
                <div>
                  <Text>Auto Promotion</Text>
                  <Text size="xs" c="dimmed">
                    Automatically promote to a queen when a pawn reaches the
                    last rank
                  </Text>
                </div>
                <SettingsSwitch atom={autoPromoteAtom} />
              </Group>
              <Group
                justify="space-between"
                wrap="nowrap"
                gap="xl"
                className={classes.item}
              >
                <div>
                  <Text>Coordinates</Text>
                  <Text size="xs" c="dimmed">
                    Show coordinates on the board
                  </Text>
                </div>
                <SettingsSwitch atom={showCoordinatesAtom} />
              </Group>
              <Group
                justify="space-between"
                wrap="nowrap"
                gap="xl"
                className={classes.item}
              >
                <div>
                  <Text>Auto Save</Text>
                  <Text size="xs" c="dimmed">
                    Auto save to file after each move
                  </Text>
                </div>
                <SettingsSwitch atom={autoSaveAtom} />
              </Group>
            </Tabs.Panel>

            <Tabs.Panel value="report">
              <Text size="lg" fw={500} className={classes.title}>
                Opening Report
              </Text>
              <Text size="xs" c="dimmed" mt={3} mb="lg">
                Customize the opening report settings
              </Text>
              <Group
                justify="space-between"
                wrap="nowrap"
                gap="xl"
                className={classes.item}
              >
                <div>
                  <Text>Percentage Coverage</Text>
                  <Text size="xs" c="dimmed">
                    Percentage of moves covered in each position
                  </Text>
                </div>
                <SettingsNumberInput
                  atom={percentageCoverageAtom}
                  min={50}
                  max={100}
                  step={1}
                />
              </Group>

              <Group
                justify="space-between"
                wrap="nowrap"
                gap="xl"
                className={classes.item}
              >
                <div>
                  <Text>Minimum Games</Text>
                  <Text size="xs" c="dimmed">
                    Minimum number of games in each position for it to be
                    considered
                  </Text>
                </div>
                <SettingsNumberInput atom={minimumGamesAtom} min={0} step={1} />
              </Group>
            </Tabs.Panel>

            <Tabs.Panel value="anarchy">
              <Text size="lg" fw={500} className={classes.title}>
                Anarchy
              </Text>
              <Text size="xs" c="dimmed" mt={3} mb="lg">
                Fun options
              </Text>
              <Group
                justify="space-between"
                wrap="nowrap"
                gap="xl"
                className={classes.item}
              >
                <div>
                  <Text>Forced en-passant</Text>
                  <Text size="xs" c="dimmed">
                    {"Forces you to play en-passant, if it's a legal move."}
                  </Text>
                </div>
                <SettingsSwitch atom={forcedEnPassantAtom} />
              </Group>
            </Tabs.Panel>

            <Tabs.Panel value="appearance">
              <Text size="lg" fw={500} className={classes.title}>
                Appearance
              </Text>
              <Text size="xs" c="dimmed" mt={3} mb="lg">
                Customize the look of the app
              </Text>
              <Group
                justify="space-between"
                wrap="nowrap"
                gap="xl"
                className={classes.item}
              >
                <div>
                  <Text>Theme</Text>
                  <Text size="xs" c="dimmed">
                    Overall color scheme
                  </Text>
                </div>
                <ThemeButton />
              </Group>
              <Group
                justify="space-between"
                wrap="nowrap"
                gap="xl"
                className={classes.item}
              >
                <div>
                  <Text>Font Size</Text>
                  <Text size="xs" c="dimmed">
                    Overall font size
                  </Text>
                </div>
                <FontSizeSlider />
              </Group>
              <Group
                justify="space-between"
                wrap="nowrap"
                gap="xl"
                className={classes.item}
              >
                <div>
                  <Text>Piece Set</Text>
                  <Text size="xs" c="dimmed">
                    Pieces used on the boards
                  </Text>
                </div>
                <SettingsSelect
                  data={pieceSets}
                  atom={pieceSetAtom}
                  placeholder="Select piece set"
                />
              </Group>
              <Group
                justify="space-between"
                wrap="nowrap"
                gap="xl"
                className={classes.item}
              >
                <div>
                  <Text>Accent Color</Text>
                  <Text size="xs" c="dimmed">
                    Main color of the app
                  </Text>
                </div>
                <div style={{ width: 200 }}>
                  <ColorControl />
                </div>
              </Group>
            </Tabs.Panel>

            <Tabs.Panel value="keybinds">
              <Group>
                <Text size="lg" fw={500} className={classes.title}>
                  Keybinds
                </Text>
                <Tooltip label="Reset">
                  <ActionIcon onClick={() => setKeyMap(RESET)}>
                    <IconReload size="1rem" />
                  </ActionIcon>
                </Tooltip>
              </Group>
              <Text size="xs" c="dimmed" mt={3} mb="lg">
                Customize keyboard shortcuts
              </Text>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Description</Table.Th>
                    <Table.Th>Key</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {Object.entries(keyMap).map(([action, keybind]) => {
                    return (
                      <Table.Tr key={keybind.name}>
                        <Table.Td>{keybind.name}</Table.Td>
                        <Table.Td>
                          <KeybindInput action={action} keybind={keybind} />
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            </Tabs.Panel>
          </Card>
        </ScrollArea>
        <Text size="xs" c="dimmed" ta="right">
          En Croissant v{version}
        </Text>
      </Stack>
    </Tabs>
  );
}

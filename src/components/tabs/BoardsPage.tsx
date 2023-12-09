import {
  ActionIcon,
  ScrollArea,
  Tabs,
} from "@mantine/core";
import { useHotkeys, useToggle } from "@mantine/hooks";
import {
  IconPlus,
} from "@tabler/icons-react";
import { createTab, genID, Tab } from "@/utils/tabs";
import BoardAnalysis from "../boards/BoardAnalysis";
import BoardGame from "../boards/BoardGame";
import { TreeStateProvider } from "../common/TreeStateContext";
import Puzzles from "../puzzles/Puzzles";
import { BoardTab } from "./BoardTab";
import NewTabHome from "./NewTabHome";
import { useCallback, useEffect } from "react";
import { atom, useAtom, useAtomValue } from "jotai";
import { activeTabAtom, tabsAtom } from "@/atoms/atoms";
import ConfirmChangesModal from "./ConfirmChangesModal";
import { match } from "ts-pattern";
import { commands } from "@/bindings";
import { unwrap } from "@/utils/invoke";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import "react-mosaic-component/react-mosaic-component.css";
import "@/styles/react-mosaic.css";
import { Mosaic, MosaicNode } from "react-mosaic-component";
import { keyMapAtom } from "@/atoms/keybinds";
import * as classes from "./BoardsPage.css";

export default function BoardsPage() {
  const [tabs, setTabs] = useAtom(tabsAtom);
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);
  const [saveModalOpened, toggleSaveModal] = useToggle();

  useEffect(() => {
    if (tabs.length == 0) {
      createTab({
        tab: { name: "New Tab", type: "new" },
        setTabs,
        setActiveTab,
      });
    }
  }, [tabs]);

  const closeTab = useCallback(
    async (value: string | null, forced?: boolean) => {
      if (value !== null) {
        const closedTab = tabs.find((tab) => tab.value === value);
        const tabState = JSON.parse(sessionStorage.getItem(value) || "{}");
        if (tabState && closedTab?.file && tabState.dirty && !forced) {
          toggleSaveModal();
          return;
        } else if (value === activeTab) {
          const index = tabs.findIndex((tab) => tab.value === value);
          if (tabs.length > 1) {
            if (index === tabs.length - 1) {
              setActiveTab(tabs[index - 1].value);
            } else {
              setActiveTab(tabs[index + 1].value);
            }
          } else {
            setActiveTab(null);
          }
        }
        setTabs((prev) => prev.filter((tab) => tab.value !== value));
        unwrap(await commands.killEngines(value));
      }
    },
    [tabs, activeTab, setTabs, toggleSaveModal, setActiveTab]
  );

  function selectTab(index: number) {
    setActiveTab(tabs[Math.min(index, tabs.length - 1)].value);
  }

  function cycleTabs(reverse = false) {
    const index = tabs.findIndex((tab) => tab.value === activeTab);
    if (reverse) {
      if (index === 0) {
        setActiveTab(tabs[tabs.length - 1].value);
      } else {
        setActiveTab(tabs[index - 1].value);
      }
    } else {
      if (index === tabs.length - 1) {
        setActiveTab(tabs[0].value);
      } else {
        setActiveTab(tabs[index + 1].value);
      }
    }
  }

  const renameTab = useCallback(
    (value: string, name: string) => {
      setTabs((prev) =>
        prev.map((tab) => {
          if (tab.value === value) {
            return { ...tab, name };
          }
          return tab;
        })
      );
    },
    [setTabs]
  );

  const duplicateTab = useCallback(
    (value: string) => {
      const id = genID();
      const tab = tabs.find((tab) => tab.value === value);
      if (sessionStorage.getItem(value)) {
        sessionStorage.setItem(id, sessionStorage.getItem(value) || "");
      }
      if (sessionStorage.getItem(value + "-tree")) {
        sessionStorage.setItem(
          id + "-tree",
          sessionStorage.getItem(value + "-tree") || ""
        );
      }

      if (tab) {
        setTabs((prev) => [
          ...prev,
          {
            name: tab.name,
            value: id,
            type: tab.type,
          },
        ]);
        setActiveTab(id);
      }
    },
    [tabs, setTabs, setActiveTab]
  );

  const keyMap = useAtomValue(keyMapAtom);
  useHotkeys([
    [keyMap.CLOSE_TAB.keys, () => closeTab(activeTab)],
    [keyMap.CYCLE_TABS.keys, () => cycleTabs()],
    [keyMap.REVERSE_CYCLE_TABS.keys, () => cycleTabs(true)],
    ["alt+1", () => selectTab(0)],
    ["ctrl+1", () => selectTab(0)],
    ["alt+2", () => selectTab(1)],
    ["ctrl+2", () => selectTab(1)],
    ["alt+3", () => selectTab(2)],
    ["ctrl+3", () => selectTab(2)],
    ["alt+4", () => selectTab(3)],
    ["ctrl+4", () => selectTab(3)],
    ["alt+5", () => selectTab(4)],
    ["ctrl+5", () => selectTab(4)],
    ["alt+6", () => selectTab(5)],
    ["ctrl+6", () => selectTab(5)],
    ["alt+7", () => selectTab(6)],
    ["ctrl+7", () => selectTab(6)],
    ["alt+8", () => selectTab(7)],
    ["ctrl+8", () => selectTab(7)],
    ["alt+9", () => selectTab(tabs.length - 1)],
    ["ctrl+9", () => selectTab(tabs.length - 1)],
  ]);

  return (
    <>
      <ConfirmChangesModal
        opened={saveModalOpened}
        toggle={toggleSaveModal}
        closeTab={() => closeTab(activeTab, true)}
      />
      <Tabs
        value={activeTab}
        onChange={(v) => setActiveTab(v)}
        keepMounted={false}
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
        }}
      >
        <ScrollArea type="never" h="3.75rem" px="md" pt="sm">
          <DragDropContext
            onDragEnd={({ destination, source }) =>
              destination?.index !== undefined &&
              setTabs((prev) => {
                const result = Array.from(prev);
                const [removed] = result.splice(source.index, 1);
                result.splice(destination.index, 0, removed);
                return result;
              })
            }
          >
            <Droppable droppableId="droppable" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{ display: "flex" }}
                >
                  {tabs.map((tab, i) => (
                    <Draggable
                      key={tab.value}
                      draggableId={tab.value}
                      index={i}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <BoardTab
                            tab={tab}
                            setActiveTab={setActiveTab}
                            closeTab={closeTab}
                            renameTab={renameTab}
                            duplicateTab={duplicateTab}
                            selected={activeTab === tab.value}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  <ActionIcon
                    variant="default"
                    onClick={() =>
                      createTab({
                        tab: {
                          name: "New Tab",
                          type: "new",
                        },
                        setTabs,
                        setActiveTab,
                      })
                    }
                    size="lg"
                    classNames={{
                      root: classes.newTab,
                    }}
                  >
                    <IconPlus />
                  </ActionIcon>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </ScrollArea>
        {tabs.map((tab) => (
          <Tabs.Panel
            key={tab.value}
            value={tab.value}
            h="100%"
            w="100%"
            pb="sm"
            px="sm"
          >
            <TabSwitch tab={tab} />
          </Tabs.Panel>
        ))}
      </Tabs>
    </>
  );
}

type ViewId = "left" | "topRight" | "bottomRight";

const fullLayout: { [viewId: string]: JSX.Element } = {
  left: <div id="left" />,
  topRight: <div id="topRight" />,
  bottomRight: <div id="bottomRight" />,
};

interface WindowsState {
  currentNode: MosaicNode<ViewId> | null;
}

const windowsStateAtom = atom<WindowsState>({
  currentNode: {
    direction: "row",
    first: "left",
    second: {
      direction: "column",
      first: "topRight",
      second: "bottomRight",
    },
  },
});

function TabSwitch({ tab }: { tab: Tab }) {
  const [windowsState, setWindowsState] = useAtom(windowsStateAtom);

  return match(tab.type)
    .with("new", () => <NewTabHome id={tab.value} />)
    .with("play", () => (
      <TreeStateProvider id={tab.value}>
        <Mosaic<ViewId>
          renderTile={(id) => fullLayout[id]}
          value={windowsState.currentNode}
          onChange={(currentNode) => setWindowsState({ currentNode })}
          resize={{ minimumPaneSizePercentage: 0 }}
        />
        <BoardGame />
      </TreeStateProvider>
    ))
    .with("analysis", () => (
      <TreeStateProvider id={tab.value}>
        <Mosaic<ViewId>
          renderTile={(id) => fullLayout[id]}
          value={windowsState.currentNode}
          onChange={(currentNode) => setWindowsState({ currentNode })}
          resize={{ minimumPaneSizePercentage: 0 }}
        />
        <BoardAnalysis />
      </TreeStateProvider>
    ))
    .with("puzzles", () => (
      <>
        <Mosaic<ViewId>
          renderTile={(id) => fullLayout[id]}
          value={windowsState.currentNode}
          onChange={(currentNode) => setWindowsState({ currentNode })}
          resize={{ minimumPaneSizePercentage: 0 }}
        />
        <Puzzles id={tab.value} />
      </>
    ))
    .exhaustive();
}

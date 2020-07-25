import React, {
  useState,
  useCallback,
  createContext,
  useEffect,
  useContext,
} from "react";

const Context = createContext();

export function DropdownProvider({ children }) {
  const [options, setOptions] = useState([]);
  const [targetId, setTargetId] = useState(null);
  const [cachedId, setCachedId] = useState(null);

  const registerOption = useCallback(
    ({
      id,
      optionDimensions,
      optionCenterX,
      WrappedContent,
      backgroundHeight,
    }) => {
      setOptions((items) => [
        ...items,
        {
          id,
          optionDimensions,
          optionCenterX,
          WrappedContent,
          backgroundHeight,
        },
      ]);
    },
    [setOptions]
  );

  const updateOptionProps = useCallback(
    (optionId, props) => {
      setOptions((items) =>
        items.map((item) =>
          item.id === optionId ? { ...props, ...item } : item
        )
      );
    },
    [setOptions]
  );

  const getOptionById = useCallback(
    (id) => options.find((item) => item.id === id),
    [options]
  );

  const deleteOptionById = useCallback(
    (id) => setOptions((items) => items.filter((item) => item.id !== id)),
    [setOptions]
  );

  useEffect(() => {
    if (targetId !== null) setCachedId(targetId);
  }, [targetId, setCachedId]);

  return (
    <Context.Provider
      value={{
        registerOption,
        updateOptionProps,
        getOptionById,
        deleteOptionById,
        options,
        targetId,
        setTargetId,
        cachedId,
        setCachedId,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useDropdownContext() {
  const context = useContext(Context);

  return context;
}

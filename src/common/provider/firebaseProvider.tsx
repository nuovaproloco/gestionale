import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { FireStoreDb } from "../const/firebaseapp.ts";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { Listitem } from "../type/types";
import { useLocalStorage } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";

interface DefaultValue {
  getStorage: (path?: string) => Promise<Listitem[]>;
  addItemStorage: (x: Listitem, path?: string) => void;
  deleteStorageItem: (x: Listitem, path?: string) => void;
  updateStorageItem: (x: Listitem, path?: string) => void;
  lastUpdate: string;
  dbReady: boolean;
  signinWithGoogle: () => Promise<any>;
}
const FirebaseContext = createContext<DefaultValue>({
  getStorage: () => new Promise((resolve) => resolve([])),
  addItemStorage: () => {},
  deleteStorageItem: () => {},
  updateStorageItem: () => {},
  lastUpdate: "",
  dbReady: false,
  signinWithGoogle: () => new Promise((resolve) => resolve()),
});
interface Props {
  children: ReactNode;
}
const FirebaseDbProvider = ({ children }: Props) => {
  const [lastUpdate, setLastUpdate] = useState(new Date().toUTCString());
  const [isLogged] = useLocalStorage({ key: "login", defaultValue: "" });
  const navigate = useNavigate();
  const auth = getAuth();
  const authProvider = new GoogleAuthProvider();

  function signinWithGoogle() {
    return signInWithPopup(auth, authProvider);
  }
  async function getItems(path?: string) {
    if (FireStoreDb)
      return await getDocs(collection(FireStoreDb, path ?? "magazzino")).then(
        (querySnapshot) => {
          setLastUpdate(new Date().toUTCString());
          return querySnapshot.docs.map((doc) => doc.data() as Listitem);
        },
      );
  }
  async function addItem(item: Listitem, path?: string) {
    const uuid = uuidv4();
    if (FireStoreDb) {
      try {
        // noinspection TypeScriptValidateTypes
        return await setDoc(doc(FireStoreDb, path ?? `magazzino`, uuid), {
          ...item,
          id: uuid,
        }).then(() => {
          setLastUpdate(new Date().toUTCString());
        });
      } catch (e) {
        console.error(e);
      }
    }
  }
  async function updateItem(item: Listitem, path?: string) {
    if (FireStoreDb) {
      await updateDoc<Listitem>(
        doc(FireStoreDb, path ?? "magazzino", item.id),
        item,
      ).then(() => setLastUpdate(new Date().toUTCString()));
    }
  }
  async function deleteItem(item: Listitem, path?: string) {
    if (FireStoreDb) {
      await deleteDoc(doc(FireStoreDb, path ?? "magazzino", item.id)).then(() =>
        setLastUpdate(new Date().toUTCString()),
      );
    }
  }

  useEffect(() => {
    if (!isLogged) navigate("login");
  }, [isLogged]);

  return (
    <FirebaseContext.Provider
      value={{
        getStorage: getItems,
        addItemStorage: addItem,
        deleteStorageItem: deleteItem,
        updateStorageItem: updateItem,
        dbReady: !!FireStoreDb,
        lastUpdate,
        signinWithGoogle,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseDbProvider;

export const useFirebaseApp = () => useContext(FirebaseContext);

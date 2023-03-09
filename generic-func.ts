
interface CacheGenericHost<ContentType> {
    save: (obj: ContentType) => void;
};

function addTypedObjectToCache<Type, Cache extends CacheGenericHost<Type>>(obj: Type, cache: Cache): Cache {
    cache.save(obj);
    return cache;
}

interface PersonObject {
    name: string;
};

const personCache: CacheGenericHost<PersonObject> = {
    save: (obj: PersonObject) => console.log(obj.name)
};

const person: PersonObject = {
    name: 'Denise'
};

addTypedObjectToCache(person, personCache);
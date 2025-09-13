import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/16/solid'
import { CheckIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import ThunderboltIcon from '../ThunderboltIcon/ThunderboltIcon'

const people = [
    {
        level: 1,
        name: 'Beginner',
        desc: 'I am exploring the sport',
    },
    {
        level: 2,
        name: 'Amateur',
        desc: 'I play sometimes',
    },
    {
        level: 3,
        name: 'Intermediate',
        desc: 'I play multiple times a week'
    },
    {
        level: 4,
        name: 'Advanced',
        desc: 'I’m a competitor driven by excellence',
    },
    {
        level: 5,
        name: 'Skill',
        desc: 'Edit Your skill level',
    }
]

const LevelSelector = ({ skillLevel, isEditAble, onChange }) => {

    const setPlayerLevel = (value) => {
        if (!value) return people[4];
        return people.find(person => person.name.toLowerCase().trim() === value.toLowerCase().trim())
    } 
    
    const [selected, setSelected] = useState(setPlayerLevel(skillLevel))

    const handleChange = (newSelection) => {
        setSelected(newSelection);
        onChange(newSelection.name);
    };

    return (
        <Listbox value={selected} onChange={handleChange} disabled={!isEditAble}>
            <div className="relative mt-2">
                <ListboxButton className="flex w-full cursor-default itmes-center rounded-r-20 bg-white text-left text-gray-900 border border-f2f2f2 sm:text-sm/6 justify-between py-4 md:py-5 px-5">
                <span>
                    <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
                        <span className={`block font-general font-medium text-sm text-383838 ${isEditAble ? 'opacity-100' : 'opacity-70'}`}>{selected.name}</span>
                        <ThunderboltIcon value={selected.level} />
                    </span>
                    <p className={`font-general font-medium text-xs text-383838 ${isEditAble ? 'opacity-100' : 'opacity-70'}`}>{selected.desc}</p>
                </span>
                    <ChevronUpDownIcon
                        aria-hidden="true"
                        className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                    />
                </ListboxButton>

                <ListboxOptions
                    transition
                    className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
                >
                    {people.slice(0, -1).map((person) => (
                        <ListboxOption
                            key={person.level}
                            value={person}
                            className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white data-[focus]:outline-none"
                        >
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="block font-general font-medium text-383838 text-sm opacity-70 group-data-[focus]:text-ffffff group-data-[focus]:opacity-100">
                                        {person.name}
                                    </span>
                                    <ThunderboltIcon value={person.level} />
                                </div>
                                    <p className="block font-general font-medium text-383838 text-sm opacity-70 group-data-[focus]:text-ffffff group-data-[focus]:opacity-100">{person.desc}</p>
                            </div>

                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-[&:not([data-selected])]:hidden group-data-[focus]:text-white">
                                <CheckIcon aria-hidden="true" className="size-5 "/>
                            </span>
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </div>
        </Listbox>
    )
}

export default LevelSelector
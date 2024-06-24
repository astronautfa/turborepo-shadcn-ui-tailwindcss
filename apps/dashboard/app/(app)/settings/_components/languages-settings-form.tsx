"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "@ui/lib/utils"

import { Button } from "@ui/components/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@ui/components/form"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@ui/components/command"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@ui/components/popover"
import { Input } from "@ui/components/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@ui/components/select"
import { toast } from "sonner"
import { useState } from "react"
import { languages } from "@/consts/languages"
import { Check, ChevronsUpDown, DeleteIcon, PlusIcon } from "lucide-react"
import { TrashIcon } from "@heroicons/react/20/solid"
import { Separator } from "@ui/components/separator"

const languageSettingsFormSchema = z.object({
    studyingLanguages: z.array(
        z.object({
            value: z.string({ message: "Please select your native language" }),
        })
    ),
    nativeLanguages: z.array(
        z.object({
            value: z.string({ message: "Please select your native language" }),
        })
    ),
})

// TODO : sort out the language form with levels and also being able to add and remove fields

type languageSettingsFormValues = z.infer<typeof languageSettingsFormSchema>

// This can come from your database or API.
const defaultValues: Partial<languageSettingsFormValues> = {
    nativeLanguages: [{ value: '' }],
    studyingLanguages: [{ value: '' }],
}

export function LanguageSettingsForm() {
    const form = useForm<languageSettingsFormValues>({
        resolver: zodResolver(languageSettingsFormSchema),
        defaultValues,
        mode: "onChange",
    })

    const { fields: nativeLanguages, append: appendNativeLanguage, remove: removeNativeLanguage } = useFieldArray({
        name: "nativeLanguages",
        control: form.control,
    })

    const { fields: studyingLanguages, append: appendStudyingLanguage, remove: removeStudyingLanguage } = useFieldArray({
        name: "studyingLanguages",
        control: form.control,
    })

    const [openSelect, setOpenSelect] = useState<boolean>(false)

    function onSubmit(data: languageSettingsFormValues) {
        console.log('submitted')
        toast(
            <div className="flex flex-col">
                <p>You submitted the following values:</p>
                <pre className="mt-2 w-[320px] rounded-md bg-slate-950 p-5">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            </div>
        )
    }

    // TODO : add other language input field
    // TODO : add moving around accounts
    // TODO : display the flag in the input field
    // TODO : specify your level in your learning language
    // TODO : fix the form submission on removing language!

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex flex-col gap-3">
                    <FormLabel className="mb-1">Native Language{nativeLanguages.length > 1 && 's'}</FormLabel>
                    {nativeLanguages.map((nativeLanguage, index) => (
                        <div className="flex gap-2 w-full" key={nativeLanguage.id}>
                            <FormField
                                control={form.control}
                                name={`nativeLanguages.${index}.value`}
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-1 w-full">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn(
                                                            "w-full justify-between",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value
                                                            ? languages.find(
                                                                (language) => language.code === field.value
                                                            )?.name
                                                            : "Select language"}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[300px] p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search language..." />
                                                    <CommandEmpty>No language found.</CommandEmpty>
                                                    <CommandList>
                                                        <CommandGroup>
                                                            {languages.map((language) => (
                                                                <CommandItem
                                                                    value={language.name + " " + language.code}
                                                                    key={language.code}
                                                                    onSelect={() => {
                                                                        form.setValue(`nativeLanguages.${index}.value`, language.code)
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            language.code === field.value
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
                                                                    />
                                                                    <div className="flex gap-2">
                                                                        <p>
                                                                            {language.flag}
                                                                        </p>
                                                                        <p>
                                                                            {language.name}
                                                                        </p>
                                                                    </div>
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* TODO : add tooltip to remove language button */}
                            {index !== 0 && <Button size='icon' variant='outline'>
                                <TrashIcon className="w-4 h-4 text-destructive" onClick={() => removeNativeLanguage(index)} />
                            </Button>}
                        </div>
                    ))}
                    <div className="w-full flex justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                appendNativeLanguage({ value: "" })
                            }}
                        >
                            <PlusIcon className='w-4 h-4 mr-1' />
                            Native Language
                        </Button>
                    </div>
                    <FormDescription>
                        This is your mother tongue meaning your first language, or all of the languages you grew up in if you grew up bilingual or multilingual.
                    </FormDescription>
                </div>
                <Separator />
                <div className="flex flex-col gap-3">
                    <FormLabel className="mb-1">Studying Language{studyingLanguages.length > 1 && 's'}</FormLabel>
                    {studyingLanguages.map((studyingLanguage, index) => (
                        <div className="flex gap-2 w-full" key={studyingLanguage.id}>
                            <FormField
                                control={form.control}
                                name={`studyingLanguages.${index}.value`}
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-1 w-full">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn(
                                                            "w-full justify-between",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value
                                                            ? languages.find(
                                                                (language) => language.code === field.value
                                                            )?.name
                                                            : "Select language"}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[300px] p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search language..." />
                                                    <CommandEmpty>No language found.</CommandEmpty>
                                                    <CommandList>
                                                        <CommandGroup>
                                                            {languages.map((language) => (
                                                                <CommandItem
                                                                    value={language.name + " " + language.code}
                                                                    key={language.code}
                                                                    onSelect={() => {
                                                                        form.setValue(`studyingLanguages.${index}.value`, language.code)
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            language.code === field.value
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
                                                                    />
                                                                    <div className="flex gap-2">
                                                                        <p>
                                                                            {language.flag}
                                                                        </p>
                                                                        <p>
                                                                            {language.name}
                                                                        </p>
                                                                    </div>
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* TODO : add tooltip to remove language button */}
                            {index !== 0 &&
                                <Button size='icon' variant='outline'>
                                    <TrashIcon className="w-4 h-4 text-destructive" onClick={() => removeStudyingLanguage(index)} />
                                </Button>}
                        </div>
                    ))}
                    <div className="w-full flex justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => appendStudyingLanguage({ value: "" })}
                        >
                            <PlusIcon className='w-4 h-4 mr-1' />
                            Studying Language
                        </Button>
                    </div>
                    <FormDescription>
                        This is the language you are attempting to acquire. You could add more languages if you are a pro member.
                    </FormDescription>
                </div>
                <div className="flex justify-end w-full">
                    <Button type="submit">Update Languages</Button>
                </div>
            </form>
        </Form>
    )
}





"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";

import { supabase } from "../integrations/supabase/client";
import { useAuth } from "../hooks/useAuth";
import { inr } from "../lib/format";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


// =====================================================
// TYPES
// =====================================================

type Item = {
    product_id: string;
    name: string;
    description?: string;
    hsn_code?: string;

    quantity: number;
    unit: string;
    unit_price: number;

    discount_pct: number;
    gst_rate: number;
};


// =====================================================
// DEFAULT ITEM
// =====================================================

const blankItem = (): Item => ({
    product_id: "",
    name: "",
    description: "",
    hsn_code: "",
    quantity: 1,
    unit: "pcs",
    unit_price: 0,
    discount_pct: 0,
    gst_rate: 18,
});

// =====================================================
// PROPS
// =====================================================

interface InvoiceFormProps {
    invoiceId: string;
    customers: any[];
    products: any[];
    save: string;
    onSuccess?: () => void;
}


// =====================================================
// COMPONENT
// =====================================================

export default function InvoiceForm({
    invoiceId,
    customers,
    products,
    onSuccess,
    save
}: InvoiceFormProps) {
    const { user } = useAuth();


    // ===================================================
    // FORM STATES
    // ===================================================
    const router = useRouter();

    const [invoiceNumber, setInvoiceNumber] = useState("");

    const [customerId, setCustomerId] = useState("");
    const today = new Date().toISOString().split("T")[0];

    const [invoiceDate, setInvoiceDate] = useState(today);

    const [dueDate, setDueDate] = useState("");

    const [status, setStatus] = useState("pending");

    const [vehicleNo, setVehicleNo] = useState("");

    const [isInterstate, setIsInterstate] = useState(false);

    const [items, setItems] = useState<Item[]>([
        blankItem(),
    ]);

    const [shipping, setShipping] = useState(0);

    const [extraCharge, setExtraCharge] = useState(0);

    const [notes, setNotes] = useState("");

    const [terms, setTerms] = useState("");

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);


    useEffect(() => {
        const loadData = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) return;

            const [invoices] = await Promise.all([
                supabase
                    .from("invoices")
                    .select("invoice_number")
                    .eq("user_id", user.id),
            ]);

            const invoiceNumbers =
                invoices.data
                    ?.map((invoice) => {
                        const match =
                            invoice.invoice_number?.match(
                                /(\d+)$/
                            );

                        return match
                            ? Number(match[1])
                            : 0;
                    })
                    .filter((num) => num > 0) || [];

            const highestNumber =
                invoiceNumbers.length > 0
                    ? Math.max(...invoiceNumbers)
                    : 0;

            const nextNumber =
                String(highestNumber + 1).padStart(
                    3,
                    "0"
                );

            setInvoiceNumber(
                `Invoice-${nextNumber}`
            );
        };

        loadData();
    }, []);

    useEffect(() => {
        if (!invoiceId) return;

        const loadInvoice = async () => {
            if (!invoiceId || !user) return;

            try {
                const [
                    invoiceResult,
                    itemsResult,
                ] = await Promise.all([
                    supabase
                        .from("invoices")
                        .select("*")
                        .eq("id", invoiceId)
                        .eq("user_id", user.id)
                        .single(),

                    supabase
                        .from("invoice_items")
                        .select("*")
                        .eq("invoice_id", invoiceId)
                        .eq("user_id", user.id)
                        .order("position", {
                            ascending: true,
                        }),
                ]);

                if (invoiceResult.error) {
                    throw invoiceResult.error;
                }

                if (itemsResult.error) {
                    throw itemsResult.error;
                }

                const invoice = invoiceResult.data;

                const invoiceItems =
                    itemsResult.data || [];

                setInvoiceNumber(
                    invoice.invoice_number || ""
                );

                setCustomerId(
                    invoice.customer_id || ""
                );

                setInvoiceDate(
                    invoice.invoice_date || ""
                );

                setDueDate(
                    invoice.due_date || ""
                );

                setVehicleNo(
                    invoice.vehicle_no || ""
                );

                setStatus(
                    invoice.status || "pending"
                );

                setIsInterstate(
                    invoice.is_interstate || false
                );

                setShipping(
                    Number(invoice.shipping || 0)
                );

                setExtraCharge(
                    Number(
                        invoice.additional_charge || 0
                    )
                );

                setNotes(
                    invoice.notes || ""
                );

                setTerms(
                    invoice.terms || ""
                );

                // -------------------------------
                // Invoice items
                // -------------------------------

                if (invoiceItems.length > 0) {
                    setItems(
                        invoiceItems.map((item) => {
                            // First try product_id
                            let product = products.find(
                                (p) => p.id === item.product_id
                            );

                            // If product_id is missing, find by product name
                            if (!product && item.name) {
                                product = products.find(
                                    (p) =>
                                        p.name.trim().toLowerCase() ===
                                        item.name.trim().toLowerCase()
                                );
                            }

                            return {
                                product_id: product?.id || "",

                                name:
                                    item.name ||
                                    product?.name ||
                                    "",

                                description:
                                    item.description ||
                                    product?.description ||
                                    "",

                                hsn_code:
                                    item.hsn_code ||
                                    product?.hsn_code ||
                                    "",

                                quantity:
                                    Number(item.quantity || 0),

                                unit:
                                    item.unit ||
                                    product?.unit ||
                                    "pcs",

                                unit_price:
                                    Number(
                                        item.unit_price ??
                                        product?.unit_price ??
                                        0
                                    ),

                                discount_pct:
                                    Number(item.discount_pct || 0),

                                gst_rate:
                                    Number(
                                        item.gst_rate ??
                                        product?.gst_rate ??
                                        18
                                    ),
                            };
                        })
                    );
                } else {
                    setItems([blankItem()]);
                }

            } catch (error: any) {
                console.error(
                    "Load invoice error:",
                    error
                );

                toast.error(
                    error?.message ||
                    "Failed to load invoice"
                );
            }
        };
        loadInvoice();
    }, [invoiceId]);


    // ===================================================
    // CALCULATE TOTALS
    // ===================================================

    const calc = useMemo(() => {
        let subtotal = 0;

        let totalDiscount = 0;

        let totalTax = 0;


        const lines = items.map((item) => {
            const qty =
                Number(item.quantity || 0);

            const price =
                Number(item.unit_price || 0);

            const discountPct =
                Number(item.discount_pct || 0);

            const gstRate =
                Number(item.gst_rate || 0);


            const gross =
                qty * price;


            const discountAmt =
                (gross * discountPct) / 100;


            const taxable =
                gross - discountAmt;


            const taxAmt =
                (taxable * gstRate) / 100;


            subtotal += gross;

            totalDiscount += discountAmt;

            totalTax += taxAmt;


            return {
                gross,
                taxable,
                taxAmt,
                total:
                    taxable + taxAmt,
            };
        });


        const cgst =
            isInterstate
                ? 0
                : totalTax / 2;


        const sgst =
            isInterstate
                ? 0
                : totalTax / 2;


        const igst =
            isInterstate
                ? totalTax
                : 0;


        const grandTotal =
            subtotal -
            totalDiscount +
            totalTax +
            Number(shipping || 0) +
            Number(extraCharge || 0);


        return {
            subtotal,

            discount:
                totalDiscount,

            totalTax,

            cgst,

            sgst,

            igst,

            lines,

            grandTotal:
                Number.isNaN(grandTotal)
                    ? 0
                    : grandTotal,
        };
    }, [
        items,
        isInterstate,
        shipping,
        extraCharge,
    ]);


    const updateItem = (
        index: number,
        patch: Partial<Item>
    ) => {
        setItems((prev) =>
            prev.map((item, i) =>
                i === index
                    ? {
                        ...item,
                        ...patch,
                    }
                    : item
            )
        );
    };

    const pickProduct = (
        index: number,
        productId: string
    ) => {
        const product = products.find(
            (p) => p.id === productId
        );

        if (!product) return;

        setItems((prev) =>
            prev.map((item, i) =>
                i === index
                    ? {
                        ...item,

                        product_id:
                            productId,

                        name:
                            product.name,

                        description:
                            product.description ||
                            "",

                        hsn_code:
                            product.hsn_code ||
                            "",

                        unit:
                            product.unit ||
                            "pcs",

                        unit_price:
                            Number(
                                product.unit_price ||
                                0
                            ),
                    }
                    : item
            )
        );
    };

    const saveInvoice = async () => {
        if (!user) {
            toast.error("User not found");
            return;
        }

        // Update mode requires invoiceId
        if (save === "Update" && !invoiceId) {
            toast.error("Invoice ID missing");
            return;
        }

        if (!customerId) {
            toast.error("Pick a customer");
            return;
        }

        if (items.some((item) => !item.name)) {
            toast.error("All items need a name");
            return;
        }

        setSaving(true);

        try {
            // =====================================================
            // FIND CUSTOMER
            // =====================================================

            const customer = customers.find(
                (c) => c.id === customerId
            );

            // =====================================================
            // COMMON INVOICE DATA
            // =====================================================

            const invoiceData = {
                invoice_number: invoiceNumber,

                customer_id: customerId,

                customer_snapshot: customer,

                invoice_date: invoiceDate,

                vehicle_no: vehicleNo,

                due_date: dueDate || null,

                status,

                is_interstate: isInterstate,

                subtotal: calc.subtotal,

                discount: calc.discount,

                cgst: calc.cgst,

                sgst: calc.sgst,

                igst: calc.igst,

                shipping: Number(shipping || 0),

                additional_charge:
                    Number(extraCharge || 0),

                total: calc.grandTotal,

                notes,

                terms,
            } as any;


            if (save === "Update") {

                const {
                    error: invoiceError,
                } = await supabase
                    .from("invoices")
                    .update(invoiceData)
                    .eq("id", invoiceId)
                    .eq("user_id", user.id);

                if (invoiceError) {
                    throw invoiceError;
                }


                // -----------------------------------------------
                // DELETE OLD ITEMS
                // -----------------------------------------------

                const {
                    error: deleteError,
                } = await supabase
                    .from("invoice_items")
                    .delete()
                    .eq("invoice_id", invoiceId)
                    .eq("user_id", user.id);

                if (deleteError) {
                    throw deleteError;
                }

                const itemRows = items.map((item, index) => ({
                    invoice_id: invoiceId,
                    user_id: user.id,

                    product_id: item.product_id || null,

                    name: item.name,
                    description: item.description || null,
                    hsn_code: item.hsn_code || null,

                    quantity: item.quantity,
                    unit: item.unit,
                    unit_price: item.unit_price,

                    discount_pct: item.discount_pct,

                    taxable: calc.lines[index].taxable,
                    tax_amount: calc.lines[index].taxAmt,
                    total: calc.lines[index].total,

                    position: index,
                }));


                const {
                    error: itemError,
                } = await supabase
                    .from("invoice_items")
                    .insert(itemRows);

                if (itemError) {
                    throw itemError;
                }


                toast.success(
                    "Invoice updated successfully"
                );

                onSuccess?.();

                return;
            }


            // =====================================================
            // CREATE NEW INVOICE
            // =====================================================

            if (save === "Save") {

                const {
                    data: newInvoice,
                    error: invoiceError,
                } = await supabase
                    .from("invoices")
                    .insert({
                        ...invoiceData,

                        user_id: user.id,
                    })
                    .select("id")
                    .single();

                if (invoiceError) {
                    throw invoiceError;
                }

                if (!newInvoice) {
                    throw new Error(
                        "Invoice was not created"
                    );
                }


                // -----------------------------------------------
                // CREATE ITEMS
                // -----------------------------------------------

                const itemRows = items.map(
                    (item, index) => ({
                        invoice_id:
                            newInvoice.id,

                        user_id:
                            user.id,

                        name:
                            item.name,

                        description:
                            item.description || null,

                        hsn_code:
                            item.hsn_code || null,

                        quantity:
                            item.quantity,

                        unit:
                            item.unit,

                        unit_price:
                            item.unit_price,

                        discount_pct:
                            item.discount_pct,

                        taxable:
                            calc.lines[index].taxable,

                        tax_amount:
                            calc.lines[index].taxAmt,

                        total:
                            calc.lines[index].total,

                        position:
                            index,
                    })
                );


                const {
                    error: itemError,
                } = await supabase
                    .from("invoice_items")
                    .insert(itemRows);

                if (itemError) {
                    throw itemError;
                }


                toast.success(
                    "Invoice saved successfully"
                );
                router.push(`/dashboard/invoices/${newInvoice.id}`);
                onSuccess?.();

                return;
            }

        } catch (error: any) {

            console.error(
                "Invoice save/update error:",
                error
            );

            toast.error(
                error?.message ||
                `Failed to ${save === "Update"
                    ? "update"
                    : "save"} invoice`
            );

        } finally {
            setSaving(false);
        }
    };

    const uniqueProducts = Array.from(
        new Map(
            products.map((product) => [
                product.id,
                product,
            ])
        ).values()
    );
    const duplicateIds = products
        .map((p) => p.id)
        .filter(
            (id, index, arr) =>
                arr.indexOf(id) !== index
        );

    console.log("Products:", products);
    console.log("Duplicate IDs:", duplicateIds);

    return (
        <div className="gap-6 flex flex-col">
            <div className="bg-card border border-border rounded-xl p-6 shadow-card">

                <h3 className="font-display text-lg font-semibold mb-4">
                    Invoice details
                </h3>


                <div className="grid md:grid-cols-2 gap-4">

                    {/* Invoice Number */}

                    <div className="space-y-2">

                        <Label>
                            Invoice #
                        </Label>

                        <Input
                            value={invoiceNumber}
                            onChange={(e) =>
                                setInvoiceNumber(
                                    e.target.value
                                )
                            }
                            placeholder="Invoice number"
                        />

                    </div>


                    {/* Customer */}

                    <div className="space-y-2">

                        <Label>
                            Customer
                        </Label>

                        <Select
                            value={customerId}
                            onValueChange={
                                setCustomerId
                            }
                        >

                            <SelectTrigger>
                                <SelectValue placeholder="Select customer" />
                            </SelectTrigger>


                            <SelectContent>

                                {customers.length === 0 ? (

                                    <div className="px-3 py-2 text-sm text-muted-foreground">
                                        No customers — add one in Customers
                                    </div>

                                ) : (

                                    customers.map((customer) => (

                                        <SelectItem
                                            key={customer.id}
                                            value={customer.id}
                                        >
                                            {customer.name}
                                        </SelectItem>

                                    ))

                                )}

                            </SelectContent>

                        </Select>

                    </div>


                    {/* Invoice Date */}

                    <div className="space-y-2">

                        <Label>
                            Invoice date
                        </Label>

                        <Input
                            type="date"
                            value={invoiceDate}
                            onChange={(e) =>
                                setInvoiceDate(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    {/* Due Date */}

                    <div className="space-y-2">

                        <Label>
                            Due date
                        </Label>

                        <Input
                            type="date"
                            value={dueDate}
                            onChange={(e) =>
                                setDueDate(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    {/* Status */}

                    <div className="space-y-2">

                        <Label>
                            Status
                        </Label>

                        <Select
                            value={status}
                            onValueChange={
                                setStatus
                            }
                        >

                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>


                            <SelectContent>

                                <SelectItem value="pending">
                                    Pending
                                </SelectItem>

                                <SelectItem value="paid">
                                    Paid
                                </SelectItem>

                                <SelectItem value="partial">
                                    Partial
                                </SelectItem>

                            </SelectContent>

                        </Select>

                    </div>


                    {/* Vehicle */}

                    <div className="space-y-2">

                        <Label>
                            Vehicle No
                        </Label>

                        <Input
                            value={vehicleNo}
                            onChange={(e) =>
                                setVehicleNo(
                                    e.target.value
                                )
                            }
                            placeholder="Vehicle number"
                        />

                    </div>


                    {/* Interstate */}

                    <div className="flex items-center justify-between rounded-md border border-border px-3">

                        <div>

                            <Label className="cursor-pointer">
                                Inter-state (IGST)
                            </Label>

                            <p className="text-xs text-muted-foreground">
                                Auto-set from customer state
                            </p>

                        </div>


                        <Switch
                            checked={isInterstate}
                            onCheckedChange={
                                setIsInterstate
                            }
                        />

                    </div>

                </div>

            </div>

            <div className="bg-card border border-border rounded-xl p-6 shadow-card">

                <div className="flex items-center justify-between mb-4">

                    <h3 className="font-display text-lg font-semibold">
                        Line items
                    </h3>


                    <Button
                        size="sm"
                        variant="outline"
                        type="button"
                        onClick={() => {
                            setItems((prev) => [
                                ...prev,
                                blankItem(),
                            ]);
                        }}
                    >
                        <Plus className="h-4 w-4" />
                        Add item
                    </Button>

                </div>


                <div className="space-y-3">

                    {items.map((item, index) => (

                        <div
                            key={index}
                            className="border border-border rounded-lg p-4 bg-muted/20"
                        >

                            <div className="grid md:grid-cols-12 gap-3">

                                {/* Product */}

                                <div className="md:col-span-3 space-y-1.5">

                                    <Label className="text-xs">
                                        Product / Service
                                    </Label>


                                    <Select
                                        value={item.product_id || ""}
                                        onValueChange={(value) =>
                                            pickProduct(index, value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select product..." />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {uniqueProducts.length === 0 ? (
                                                <div className="px-3 py-2 text-sm text-muted-foreground">
                                                    No products found
                                                </div>
                                            ) : (
                                                uniqueProducts.map((product) => (
                                                    <SelectItem
                                                        key={product.id}
                                                        value={product.id}
                                                    >
                                                        {product.name}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>


                                {/* Quantity */}

                                <div className="md:col-span-2 space-y-1.5">

                                    <Label className="text-xs">
                                        Qty
                                    </Label>


                                    <Input
                                        type="number"
                                        min={0}
                                        value={item.quantity}
                                        onChange={(e) =>
                                            updateItem(
                                                index,
                                                {
                                                    quantity:
                                                        Number(
                                                            e.target.value
                                                        ),
                                                }
                                            )
                                        }
                                    />

                                </div>


                                {/* Price */}

                                <div className="md:col-span-2 space-y-1.5">

                                    <Label className="text-xs">
                                        Unit Price (₹)
                                    </Label>


                                    <Input
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        value={
                                            item.unit_price
                                        }
                                        onChange={(e) =>
                                            updateItem(
                                                index,
                                                {
                                                    unit_price:
                                                        Number(
                                                            e.target.value
                                                        ),
                                                }
                                            )
                                        }
                                    />

                                </div>


                                {/* Discount */}

                                <div className="md:col-span-2 space-y-1.5">

                                    <Label className="text-xs">
                                        Disc %
                                    </Label>


                                    <Input
                                        type="number"
                                        min={0}
                                        max={100}
                                        value={
                                            item.discount_pct
                                        }
                                        onChange={(e) =>
                                            updateItem(
                                                index,
                                                {
                                                    discount_pct:
                                                        Number(
                                                            e.target.value
                                                        ),
                                                }
                                            )
                                        }
                                    />

                                </div>


                                {/* Total */}

                                <div className="md:col-span-2 space-y-1.5">
                                    <Label className="text-xs">Total</Label>
                                    <div className="h-10 flex items-center font-semibold text-sm">
                                        {inr(calc.lines[index]?.gross || 0)}
                                    </div>
                                </div>


                                {/* Delete */}

                                <div className="md:col-span-1 flex items-end justify-end">

                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() =>
                                            setItems(
                                                items.filter(
                                                    (_, x) =>
                                                        x !== index
                                                )
                                            )
                                        }
                                        disabled={
                                            items.length === 1
                                        }
                                    >

                                        <Trash2 className="h-4 w-4 text-destructive" />

                                    </Button>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

            <div className="bg-card border border-border rounded-xl p-6 shadow-card">

                <h3 className="font-display text-lg font-semibold mb-4">
                    Summary
                </h3>


                <div className="space-y-3">

                    <div className="flex justify-between">

                        <span className="text-muted-foreground">
                            Subtotal
                        </span>

                        <span>
                            {inr(calc.subtotal)}
                        </span>

                    </div>


                    <div className="flex justify-between">

                        <span className="text-muted-foreground">
                            Discount
                        </span>

                        <span>
                            − {inr(calc.discount)}
                        </span>

                    </div>


                    {isInterstate ? (

                        <div className="flex justify-between">

                            <span className="text-muted-foreground">
                                IGST
                            </span>

                            <span>
                                {inr(calc.igst)}
                            </span>

                        </div>

                    ) : (

                        <>
                            <div className="flex justify-between">

                                <span className="text-muted-foreground">
                                    CGST
                                </span>

                                <span>
                                    {inr(calc.cgst)}
                                </span>

                            </div>


                            <div className="flex justify-between">

                                <span className="text-muted-foreground">
                                    SGST
                                </span>

                                <span>
                                    {inr(calc.sgst)}
                                </span>

                            </div>
                        </>

                    )}


                    {/* Shipping */}

                    <div className="flex justify-between items-center gap-2">

                        <span className="text-muted-foreground">
                            Shipping
                        </span>

                        <Input
                            type="number"
                            min={0}
                            value={shipping}
                            onChange={(e) =>
                                setShipping(
                                    Number(e.target.value)
                                )
                            }
                            className="w-28 h-8 text-right"
                        />

                    </div>


                    {/* Other charge */}

                    <div className="flex justify-between items-center gap-2">

                        <span className="text-muted-foreground">
                            Other charge
                        </span>

                        <Input
                            type="number"
                            min={0}
                            value={extraCharge}
                            onChange={(e) =>
                                setExtraCharge(
                                    Number(e.target.value)
                                )
                            }
                            className="w-28 h-8 text-right"
                        />

                    </div>


                    {/* Grand Total */}

                    <div className="border-t border-border pt-3 mt-3 flex justify-between items-baseline">

                        <span className="font-display text-base font-semibold">
                            Total
                        </span>

                        <span className="font-display text-2xl font-semibold text-primary">
                            {inr(calc.grandTotal)}
                        </span>

                    </div>

                </div>

            </div>

            <div className="flex justify-end gap-3">

                <Button
                    variant="outline"
                    onClick={() =>
                        onSuccess?.()
                    }
                    disabled={saving}
                >
                    Cancel
                </Button>


                <Button
                    onClick={saveInvoice}
                    disabled={saving}
                    className="bg-primary hover:bg-primary-glow"
                >

                    <Save className="h-4 w-4 mr-2" />

                    {saving
                        ? `${save}...`
                        : `${save} Invoice`}

                </Button>

            </div>


        </div>
    );
}

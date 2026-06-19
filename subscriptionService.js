// ============================================
// subscriptionService.js
// Gestion des abonnements
// ============================================

const TRIAL_DURATION = 72 * 60 * 60 * 1000;

const ADMIN_ROLE = "admin";

export const SubscriptionStatus = {

    TRIAL: "trial",

    ACTIVE: "active",

    EXPIRED: "expired",

    ADMIN: "admin"

};

export function createSubscription(user) {

    const now = Date.now();

    return {

        userId: user.id,

        fullName: user.fullName,

        phone: user.phone,

        email: user.email,

        role: user.role || "user",

        createdAt: now,

        trialEndsAt: now + TRIAL_DURATION,

        paidUntil: null,

        status: SubscriptionStatus.TRIAL

    };

}

export function isAdministrator(subscription) {

    return subscription.role === ADMIN_ROLE;

}

export function isTrialActive(subscription) {

    if (isAdministrator(subscription)) {

        return true;

    }

    return Date.now() < subscription.trialEndsAt;

}

export function hasActiveSubscription(subscription) {

    if (isAdministrator(subscription)) {

        return true;

    }

    if (

        subscription.paidUntil &&

        Date.now() < subscription.paidUntil

    ) {

        return true;

    }

    return false;

}

export function canUseAI(subscription) {

    if (isAdministrator(subscription)) {

        return true;

    }

    if (isTrialActive(subscription)) {

        return true;

    }

    return hasActiveSubscription(subscription);

}

export function getTrialRemaining(subscription) {

    if (isAdministrator(subscription)) {

        return Infinity;

    }

    return Math.max(

        0,

        subscription.trialEndsAt - Date.now()

    );

}

export function findExistingUser(users, phone, email) {

    return users.find(user =>

        user.phone === phone ||

        user.email.toLowerCase() === email.toLowerCase()

    );

}

export function canCreateAccount(

    users,

    phone,

    email

) {

    return !findExistingUser(

        users,

        phone,

        email

    );

}


// ============================================
// Paiements
// ============================================

export const PAYMENT_METHODS = {

    MPESA: "mpesa",

    ORANGE_MONEY: "orange_money",

    AIRTEL_MONEY: "airtel_money",

    VISA: "visa"

};

export const SUBSCRIPTION_PRICE = {

    amount: 6.90,

    currency: "USD",

    duration: 45

};

export function createPaymentRequest(

    user,

    method

) {

    return {

        userId: user.id,

        method,

        amount: SUBSCRIPTION_PRICE.amount,

        currency: SUBSCRIPTION_PRICE.currency,

        status: "pending",

        createdAt: Date.now()

    };

}

export function activateSubscription(

    subscription

) {

    const now = Date.now();

    subscription.status = SubscriptionStatus.ACTIVE;

    subscription.paidUntil =

        now +

        SUBSCRIPTION_PRICE.duration *

        24 *

        60 *

        60 *

        1000;

    return subscription;

} 

export function checkSubscription(

    subscription

) {

    if (

        isAdministrator(subscription)

    ) {

        return SubscriptionStatus.ADMIN;

    }

    if (

        hasActiveSubscription(subscription)

    ) {

        return SubscriptionStatus.ACTIVE;

    }

    if (

        isTrialActive(subscription)

    ) {

        return SubscriptionStatus.TRIAL;

    }

    subscription.status =

        SubscriptionStatus.EXPIRED;

    return subscription.status;

}

export function getRemainingDays(

    subscription

) {

    let end = subscription.paidUntil;

    if (

        isTrialActive(subscription)

    ) {

        end = subscription.trialEndsAt;

    }

    return Math.ceil(

        (end - Date.now()) /

        (1000 * 60 * 60 * 24)

    );

}

export function shouldNotify(

    subscription

) {

    const days =

        getRemainingDays(subscription);

    return days <= 3;

  }

const paymentHistory = [];

export function savePayment(

    payment

) {

    paymentHistory.push(payment);

}

export function getPayments(

    userId

) {

    return paymentHistory.filter(

        payment =>

        payment.userId === userId

    );

}

export function getSubscriptionInfo(

    subscription

) {

    return {

        status:

            checkSubscription(

                subscription

            ),

        remainingDays:

            getRemainingDays(

                subscription

            ),

        amount:

            SUBSCRIPTION_PRICE.amount,

        currency:

            SUBSCRIPTION_PRICE.currency

    };

}

export function enableAutoRenew(

    subscription,

    paymentMethod

) {

    subscription.autoRenew = true;

    subscription.paymentMethod = paymentMethod;

    return subscription;

}

export function disableAutoRenew(

    subscription

) {

    subscription.autoRenew = false;

    return subscription;

}

export function isAutoRenewEnabled(

    subscription

) {

    return subscription.autoRenew === true;

}

export function renewSubscription(

    subscription

) {

    const now = Date.now();

    const currentEnd = subscription.paidUntil || now;

    subscription.paidUntil =

        Math.max(currentEnd, now) +

        SUBSCRIPTION_PRICE.duration *

        24 *

        60 *

        60 *

        1000;

    subscription.status =

        SubscriptionStatus.ACTIVE;

    return subscription;

} 

export function processRenewal(

    subscription

) {

    if (

        !isAutoRenewEnabled(subscription)

    ) {

        return subscription;

    }

    if (

        hasActiveSubscription(subscription)

    ) {

        return subscription;

    }

    return renewSubscription(subscription);

}

export function savePreferredPaymentMethod(

    subscription,

    method

) {

    subscription.paymentMethod = method;

    return subscription;

}

export function getPreferredPaymentMethod(

    subscription

) {

    return subscription.paymentMethod || null;

}

export function markPaymentSuccess(

    payment

) {

    payment.status = "success";

    payment.completedAt = Date.now();

    return payment;

}

export function markPaymentFailed(

    payment,

    reason

) {

    payment.status = "failed";

    payment.reason = reason;

    payment.completedAt = Date.now();

    return payment;

}

export function isPaymentSuccessful(

    payment

) {

    return payment.status === "success";

}

export function getPaymentSummary(

    payment

) {

    return {

        amount: payment.amount,

        currency: payment.currency,

        method: payment.method,

        status: payment.status,

        createdAt: payment.createdAt,

        completedAt: payment.completedAt || null

    };

}

const transactionLogs = [];

export function saveTransaction(

    payment,

    subscription

) {

    transactionLogs.push({

        id: Date.now(),

        userId: subscription.userId,

        amount: payment.amount,

        currency: payment.currency,

        method: payment.method,

        status: payment.status,

        date: Date.now()

    });

}

export function getAllTransactions() {

    return transactionLogs;

}

export function generateReceipt(

    payment,

    subscription

) {

    return {

        receiptNumber:

            "REC-" + Date.now(),

        userId:

            subscription.userId,

        fullName:

            subscription.fullName,

        amount:

            payment.amount,

        currency:

            payment.currency,

        paymentMethod:

            payment.method,

        paymentDate:

            new Date().toISOString(),

        validUntil:

            new Date(

                subscription.paidUntil

            ).toISOString()

    };

}

export function getTotalRevenue() {

    return transactionLogs

        .filter(

            t => t.status === "success"

        )

        .reduce(

            (sum, t) =>

                sum + t.amount,

            0

        );

}

export function getActiveSubscribers(

    subscriptions

) {

    return subscriptions.filter(

        sub =>

            hasActiveSubscription(sub)

    ).length;

}

export function getTrialUsers(

    subscriptions

) {

    return subscriptions.filter(

        sub =>

            isTrialActive(sub)

    ).length;

}

export function getExpiredUsers(

    subscriptions

) {

    return subscriptions.filter(

        sub =>

            checkSubscription(sub) ===

            SubscriptionStatus.EXPIRED

    ).length;

} 

export function getAdminDashboard(

    subscriptions

) {

    return {

        totalRevenue:

            getTotalRevenue(),

        activeSubscribers:

            getActiveSubscribers(

                subscriptions

            ),

        expiredUsers:

            getExpiredUsers(

                subscriptions

            ),

        trialUsers:

            getTrialUsers(

                subscriptions

            ),

        totalTransactions:

            transactionLogs.length

    };

}

export function checkAIAccess(

    subscription

) {

    if (

        canUseAI(subscription)

    ) {

        return {

            allowed: true,

            message: null

        };

    }

    return {

        allowed: false,

        message:

            "Votre période d'essai de 72 heures ou votre abonnement de 45 jours a expiré. Veuillez renouveler votre abonnement pour continuer à utiliser l'IA."

    };

}

export async function verifyPayment(

    payment

) {

    return {

        verified: true,

        provider:

            payment.method,

        transactionId:

            "TX-" + Date.now()

    };

}

export function saveLastPaymentDate(

    subscription

) {

    subscription.lastPaymentDate =

        Date.now();

    return subscription;

}

export function isPaymentLate(

    subscription

) {

    if (

        !subscription.paidUntil

    ) {

        return true;

    }

    return Date.now() >

        subscription.paidUntil;

}


